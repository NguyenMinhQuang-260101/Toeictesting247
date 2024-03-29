import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserRuleType, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface LoginRequestBody {
  email: string
  password: string
}

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  rule: UserRuleType
  exp: number
  iat: number
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface UpdateMeReqBody {
  user_id?: string
  name?: string
  date_of_birth?: string
  username?: string
  location?: string
  avatar?: string
  cover_photo?: string
  rule?: UserRuleType
}

export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}

export interface UserQuery extends Query {
  limit: string
  page: string
}
