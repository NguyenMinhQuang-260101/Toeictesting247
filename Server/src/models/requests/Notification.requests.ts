import { ObjectId } from 'mongodb'
import { NotificationType, TargetType } from '~/constants/enums'

export interface NotificationReqBody {
  user_id: ObjectId
  type: NotificationType
  title: string
  content: string
  target_type?: TargetType
  targets: string[]
  start_at: string
  end_at: string
}
