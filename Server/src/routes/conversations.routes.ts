import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversations.controllers'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationRouter = Router()

/**
 * Description: Get all conversations
 * Path: /
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 * Query: {limit: number, page: number}
 * Params: {receiver_id: string}
 */
conversationRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidation,
  // getConversationValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationRouter
