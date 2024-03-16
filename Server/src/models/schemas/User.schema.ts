import { ObjectId } from 'mongodb'
import { UserRuleType, UserVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  name?: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  rule?: UserRuleType

  location?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  rule: UserRuleType

  location: string
  username: string
  avatar: string
  cover_photo: string

  constructor(User: UserType) {
    const date = new Date()
    this._id = User._id
    this.name = User.name || ''
    this.email = User.email
    this.date_of_birth = User.date_of_birth || date
    this.password = User.password
    this.created_at = User.created_at || date
    this.updated_at = User.updated_at || date
    this.email_verify_token = User.email_verify_token || ''
    this.forgot_password_token = User.forgot_password_token || ''
    this.verify = User.verify || UserVerifyStatus.Unverified
    this.rule = User.rule || UserRuleType.User

    this.location = User.location || ''
    this.username = User.username || ''
    this.avatar = User.avatar || ''
    this.cover_photo = User.cover_photo || ''
  }
}
