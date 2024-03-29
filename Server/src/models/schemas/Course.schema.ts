import { ObjectId } from 'mongodb'
import { Media } from '../Other'
import { CourseType, OperatingStatus } from '~/constants/enums'

interface CourseConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: CourseType
  title: string
  description: string
  content: string
  tests: string[] | []
  thumbnails: Media[]
  notification: null | string
  user_views?: number
  created_at?: Date
  updated_at?: Date
  status?: OperatingStatus
}

export default class Course {
  _id?: ObjectId
  user_id: ObjectId
  type: CourseType
  title: string
  description: string
  content: string
  tests: ObjectId[]
  thumbnail: Media[]
  notification: null | ObjectId
  user_views: number
  created_at: Date
  updated_at: Date
  status: OperatingStatus
  constructor({
    _id,
    user_id,
    title,
    description,
    content,
    tests,
    thumbnails,
    notification,
    user_views,
    type,
    created_at,
    updated_at,
    status
  }: CourseConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.title = title
    this.description = description
    this.content = content
    this.tests = tests ? tests.map((test) => new ObjectId(test)) : []
    this.thumbnail = thumbnails
    this.notification = notification ? new ObjectId(notification) : null
    this.user_views = user_views || 0
    this.type = type
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this.status = status || OperatingStatus.Inactive
  }
}
