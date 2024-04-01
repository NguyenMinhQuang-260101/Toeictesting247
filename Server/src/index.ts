import express from 'express'
import { envConfig } from './constants/config'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import { initFolder } from './utils/file'
import coursesRouter from './routes/courses.routes'
import testsRouter from './routes/tests.routes'
import questionsRouter from './routes/questions.routes'
import notificationsRouter from './routes/notifications.routes'
import documentsRouter from './routes/documents.routes'
import scoreCardsRouter from './routes/scorecards.routes'
import searchRouter from './routes/search.routes'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Conversation } from './models/schemas/Conversations.schema'
import { ObjectId } from 'mongodb'
import conversationRouter from './routes/conversations.routes'
import { verifyAccessToken } from './utils/commons'
import { TokenPayload } from './models/requests/User.requests'
import { UserVerifyStatus } from './constants/enums'
import HTTP_STATUS from './constants/httpStatus'
import { USERS_MESSAGES } from './constants/message'
import { ErrorWithStatus } from './models/Errors'

const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = envConfig.port
databaseServices.connect().then(() => {
  databaseServices.indexUsers(),
    databaseServices.indexRefreshTokens(),
    databaseServices.indexCourses(),
    databaseServices.indexDocuments(),
    databaseServices.watchTimeFields()
})
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
// tạo folder uploads
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/courses', coursesRouter)
app.use('/tests', testsRouter)
app.use('/questions', questionsRouter)
app.use('/notifications', notificationsRouter)
app.use('/documents', documentsRouter)
app.use('/scorecards', scoreCardsRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationRouter)

// Dùng sau khi đã sử dụng tất cả các routes
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: envConfig.clientUrl
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.use(async (socket, next) => {
  const { Authorization } = socket.handshake.auth
  const access_token = Authorization?.split(' ')[1]
  try {
    const decoded_authorization = await verifyAccessToken(access_token)
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
    socket.handshake.auth.decoded_authorization = decoded_authorization
    socket.handshake.auth.access_token = access_token

    next()
  } catch (error) {
    next({
      message: 'Unauthorized',
      name: 'UnauthorizedError',
      data: error
    })
  }
})

io.on('connection', (socket) => {
  console.log(`user connected with id: ${socket.id}`)
  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
  users[user_id] = { socket_id: socket.id }

  socket.use(async (packet, next) => {
    const { access_token } = socket.handshake.auth
    try {
      await verifyAccessToken(access_token)
    } catch (error) {
      next(new Error('Unauthorized'))
    }
  })

  socket.on('error', (error) => {
    if (error.message === 'Unauthorized') {
      socket.disconnect()
    }
  })

  socket.on('send_message', async (data) => {
    const { receiver_id, sender_id, content } = data.payload
    const receiver_socket_id = users[receiver_id]?.socket_id

    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id as string),
      receiver_id: new ObjectId(receiver_id as string),
      content: content
    })

    const result = await databaseServices.conversations.insertOne(conversation)
    conversation._id = result.insertedId

    if (receiver_socket_id) {
      io.to(receiver_socket_id).emit('receiver_message', {
        payload: conversation
      })
    }
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user disconnected with id: ${socket.id}`)
    console.log(users)
  })
})
