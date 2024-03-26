import { ObjectId } from 'mongodb'
import { NotificationType, TargetType } from '~/constants/enums'

interface NotificationConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: NotificationType
  title: string
  content: string
  target_type: TargetType
  targets: string[]
  start_at: Date
  end_at: Date
  created_at?: Date
  updated_at?: Date
}

export default class Notification {
  _id?: ObjectId
  user_id: ObjectId
  type: NotificationType
  title: string
  content: string
  target_type: TargetType
  targets: ObjectId[]
  start_at: Date
  end_at: Date
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    user_id,
    type,
    title,
    content,
    target_type,
    targets,
    start_at,
    end_at,
    created_at,
    updated_at
  }: NotificationConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.title = title
    this.content = content
    this.target_type = target_type
    this.targets = targets.map((item) => new ObjectId(item))
    this.start_at = start_at
    this.end_at = end_at
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
