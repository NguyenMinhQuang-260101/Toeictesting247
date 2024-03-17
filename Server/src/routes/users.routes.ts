import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Login
 * Method: POST
 * Path: /users/login
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, loginController)

/**
 * Description: Register
 * Method: POST
 * Path: /users/register
 * Body: { name: string, email: string, password: string,confirm_password: string, date_of_birth: ISO8601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
