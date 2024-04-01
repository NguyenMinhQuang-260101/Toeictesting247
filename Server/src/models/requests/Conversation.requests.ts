import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface GetConversationsParams extends ParamsDictionary {
  receiver_id: string
}

export interface ConversationQuery extends Query {
  limit: string
  page: string
}
