import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'quangnguyenminh2001@gmail.com' && password === '123456') {
    return res.json({
      message: 'Login successful!'
    })
  }
  return res.status(401).json({ message: 'Invalid email or password' })
}
