import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import { envConfig } from './constants/config'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()
const port = envConfig.port
databaseServices.connect()
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

app.use(express.json())
app.use('/users', usersRouter)

// Dùng sau khi đã sử dụng tất cả các routes
app.use(defaultErrorHandler)
