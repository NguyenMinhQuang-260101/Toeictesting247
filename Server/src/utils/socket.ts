import { ObjectId } from 'mongodb'
import { Server } from 'socket.io'
import { envConfig } from '~/constants/config'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import { Conversation } from '~/models/schemas/Conversations.schema'
import databaseServices from '~/services/database.services'
import { verifyAccessToken } from './commons'
import { Server as ServerHttp } from 'http'

const initSocket = (httpServer: ServerHttp) => {
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
        next()
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
    })
  })
}

export default initSocket
