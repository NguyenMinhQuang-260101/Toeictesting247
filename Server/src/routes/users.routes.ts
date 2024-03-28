import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  getListUserController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  userRuleValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Login
 * Method: POST
 * Path: /login
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Oauth with google
 * Method: GET
 * Path: /oauth/google
 * Query: { code: string }
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * Description: Register
 * Method: POST
 * Path: /register
 * Body: { name: string, email: string, password: string,confirm_password: string, date_of_birth: ISO8601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout
 * Method: POST
 * Path: /logout
 * Headers: { Authorization: Bearer <access_token> }
 * Body: {refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh token when access token is expired
 * Method: POST
 * Path: /refresh-token
 * Body: {refresh_token: string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Verify email when user click on the link in the email
 * Method: POST
 * Path: /verify-email
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Resend email verification link
 * Method: POST
 * Path: /resend-verify-email
 * Headers: { Authorization: Bearer <refresh_token> }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Submit email to reset password, send email with reset password link
 * Method: POST
 * Path: /forgot-password
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify link in email to reset password
 * Method: POST
 * Path: /verify-forgot-password
 * Body: { forgot_password_token: string}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password after verify link in email
 * Method: POST
 * Path: /reset-password
 * Body: { forgot_password_token: string, password: string, confirm_password: string}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get list of users
 * Method: GET
 * Path: /list
 * Headers: { Authorization: Bearer <access_token> }
 * Query: { page: number, limit: number }
 */
usersRouter.get(
  '/list',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  paginationValidation,
  wrapRequestHandler(getListUserController)
)

/**
 * Description: Get my profile
 * Method: GET
 * Path: /me
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Method: PATCH
 * Path: /me
 * Headers: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'user_id',
    'name',
    'date_of_birth',
    'username',
    'location',
    'avatar',
    'cover_photo',
    'rule'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get user profile
 * Method: GET
 * Path: /:username
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
