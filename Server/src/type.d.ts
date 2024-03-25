import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/User.requests'
import Course from './models/schemas/Course.schema'
import Notification from './models/schemas/Notification.schema'
import Test from './models/schemas/Test.schema'
import Question from './models/schemas/Question.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    course?: Course
    test?: Test
    question?: Question
    notification?: Notification
  }
}
