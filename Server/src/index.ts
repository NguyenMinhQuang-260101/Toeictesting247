import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
const app = express()
const port = 3000

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/users', usersRouter)

databaseServices.connect()
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
