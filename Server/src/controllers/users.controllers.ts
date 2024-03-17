import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import usersServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'quangnguyenminh2001@gmail.com' && password === '123456') {
    return res.json({
      message: 'Login successful!'
    })
  }
  return res.status(401).json({ message: 'Invalid email or password' })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersServices.register(req.body)
  return res.json({
    message: 'Register successful!',
    result
  })
}
