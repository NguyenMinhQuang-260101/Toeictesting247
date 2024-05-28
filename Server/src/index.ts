import express from 'express'
import { envConfig, isProduction } from './constants/config'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import { initFolder } from './utils/file'
import coursesRouter from './routes/courses.routes'
import testsRouter from './routes/tests.routes'
import questionsRouter from './routes/questions.routes'
import notificationsRouter from './routes/notifications.routes'
import documentsRouter from './routes/documents.routes'
import scoreCardsRouter from './routes/scorecards.routes'
import searchRouter from './routes/search.routes'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
import conversationRouter from './routes/conversations.routes'
import initSocket from './utils/socket'
// import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import questionsRouter_v2 from './routes/questions_v2.routes'
import testsRouter_v2 from './routes/tests_v2.routes'

// const file = fs.readFileSync(path.resolve('toeictesting247-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Tài liệu API Toeictesting247 - Xây dựng website học tiếng Anh Toeic trực tuyến',
      version: '1.0.0',
      description: `
## Mục Đích

Tài liệu này được viết để hướng dẫn lập trình viên Front-end có thể hiểu và sử dụng các API của Toeictesting247 một cách dễ dàng. API cung cấp các chức năng **quản lý người dùng**, **quản lý khoá học**, **quản lý tài liệu**, **quản lý bài kiểm tra**, **quản lý câu hỏi**, **quản lý ảnh, video, audio**, và nhiều tính năng khác.

## Thông Tin API

- **Ngôn Ngữ Lập Trình**: TypeScript
- **Môi Trường**: Node.js
- **Tài Liệu**: Swagger Editor, Swagger UI

## Các Chức Năng Chính

- **Quản Lý Người Dùng**: API cho phép tạo, sửa đổi và xóa thông tin người dùng.
- **Quản Lý Khoá Học**: Cung cấp chức năng thêm, sửa đổi, xóa khoá học.
- **Quản Lý Tài Liệu**: API cho phép quản lý các tài liệu, bao gồm ảnh, video, audio.
- **Quản Lý Bài Kiểm Tra**: Cung cấp chức năng tạo, sửa đổi, xóa bài kiểm tra.
- **Quản Lý Câu Hỏi**: Cho phép quản lý các câu hỏi liên quan đến bài kiểm tra.
- **Quản Lý Multimedia**: API cho phép quản lý ảnh, video, audio.

  **...**

## Đặc Điểm của Tài Liệu API

- **Chia nhóm**: API được chia thành các nhóm theo tag, mỗi tag tương ứng với một nhóm API cụ thể.
- **Mô tả chi tiết**: Mỗi API đều có mô tả chi tiết về input, output, cách sử dụng, cách test.
- **Ví dụ**: Mỗi API đều có một ví dụ minh họa cách sử dụng.

## Lưu Ý

- Tất cả các API được tạo ra nhằm phục vụ cho khoá luận tốt nghiệp đề tài "Xây dựng website học tiếng Anh Toeic trực tuyến".
- Không sử dụng tài liệu này vào mục đích thương mại!
`,
      contact: {
        name: 'Back-end Developer',
        email: 'quangnguyenminh2001@gmail.com'
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://opensource.org/licenses/Apache-2.0'
      }
    },
    externalDocs: {
      description: 'Find out more about Swagger',
      url: 'http://swagger.io'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      },
      {
        url: 'https://toeictesting247api.io.vn',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./openapi/*.yaml'] // files containing annotations as above
}
const openapiSpecification = swaggerJsdoc(options)

const app = express()
const httpServer = createServer(app)

// ** Bảo mật với Helmet **
app.use(helmet())

// ** Rate limiting **
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes).
  standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
})
// Apply the rate limiting middleware to all requests.
app.use(limiter)

// ** CORS **
// Khi truy cập vào client khác địa chỉ trong envConfig.clientUrl thì sẽ bị chặn bởi CORS
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*',
  optionsSuccessStatus: 200
}
app.use(cors())

const port = envConfig.port
databaseServices.connect().then(() => {
  databaseServices.indexUsers(),
    databaseServices.indexRefreshTokens(),
    databaseServices.indexCourses(),
    databaseServices.indexDocuments(),
    databaseServices.watchTimeFields()
})
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
// tạo folder uploads
initFolder()
initSocket(httpServer)

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/courses', coursesRouter)
app.use('/tests', testsRouter)
app.use('/tests-v2', testsRouter_v2)
app.use('/questions', questionsRouter)
app.use('/questions-v2', questionsRouter_v2)
app.use('/notifications', notificationsRouter)
app.use('/documents', documentsRouter)
app.use('/scorecards', scoreCardsRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

// Dùng sau khi đã sử dụng tất cả các routes
app.use(defaultErrorHandler)
