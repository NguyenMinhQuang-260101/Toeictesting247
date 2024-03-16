import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

/**
 * Method: POST
 * Path: /users/login
 * Request: { email: string, password: string }
 * Description: Login
 */
usersRouter.post('/login', loginValidator, loginController)

/**
 * Method: POST
 * Path: /users/register
 * Request: { name: string, email: string, date_of_birth: string, password: string }
 * Description: Register
 */
usersRouter.post('/register', registerController)

export default usersRouter
