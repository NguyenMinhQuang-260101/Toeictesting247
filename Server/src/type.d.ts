import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/User.requests'
import Course from './models/schemas/Course.schema'
import Notification from './models/schemas/Notification.schema'
import Test from './models/schemas/Test.schema'
import Question from './models/schemas/Question.schema'
import Document from './models/schemas/Document.schema'
import ScoreCard from './models/schemas/ScoreCard.schema'
import Question_v2 from './models/schemas/Question_v2.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    course?: Course
    document?: Document
    test?: Test
    question?: Question & { origin_id?: string }
    question_v2?: Question_v2
    notification?: Notification
    source?: Course | Document
    scorecard?: ScoreCard
  }
}
