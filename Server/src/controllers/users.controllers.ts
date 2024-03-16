import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
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

export const registerController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersServices.register({ email, password })
    return res.json({
      message: 'Register successful!',
      result
    })
  } catch (error) {
    return res.status(500).json({ error: 'Register failed!' })
  }
}
