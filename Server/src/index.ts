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

io.on('connection', (socket) => {
  console.log(`user connected with id: ${socket.id}`)
  const user_id = socket.handshake.auth._id
  users[user_id] = { socket_id: socket.id }

  console.log(users)
  socket.on('private message', (data) => {
    const receiver_socket_id = users[data.to].socket_id
    io.to(receiver_socket_id).emit('receiver private message', {
      content: data.content,
      from: user_id
    })
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user disconnected with id: ${socket.id}`)
    console.log(users)
  })
})
