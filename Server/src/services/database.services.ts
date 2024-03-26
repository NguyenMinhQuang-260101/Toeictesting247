import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { envConfig } from '~/constants/config'
import { OperatingStatus, TargetType } from '~/constants/enums'
import Course from '~/models/schemas/Course.schema'
import Notification from '~/models/schemas/Notification.schema'
import Question from '~/models/schemas/Question.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Test from '~/models/schemas/Test.schema'
import User from '~/models/schemas/User.schema'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@toeictesting247.bcdy1vx.mongodb.net/?retryWrites=true&w=majority&appName=ToeicTesting247`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  watchTimeFieldsRunning: boolean = false

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
    this.watchTimeFieldsRunning
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error occurred while connecting to MongoDB', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'username_1', 'email_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])
    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  async watchTimeFields() {
    if (this.watchTimeFieldsRunning) {
      console.log('watchTimeFields is already running.')
      return
    }

    this.watchTimeFieldsRunning = true

    const interval = setInterval(async () => {
      const currentDate = new Date()

      // Tiếp tục kiểm tra và thực hiện các hành động phù hợp với các tài liệu
      const timeBoundDocuments = await this.notifications
        .find({
          $or: [
            { start_at: { $lte: currentDate }, end_at: { $gt: currentDate } }, // Tài liệu đã bắt đầu nhưng chưa kết thúc
            { end_at: { $lte: currentDate } } // Tài liệu đã kết thúc
          ]
        })
        .toArray()

      timeBoundDocuments.forEach((document) => {
        if (document.end_at <= currentDate) {
          // Thực hiện các hành động phù hợp với tài liệu đã kết thúc
          if (document.target_type === TargetType.Course) {
            // Thực hiện các hành động phù hợp với khóa học
            document.targets.forEach(async (target: ObjectId) => {
              const course = (await this.courses.findOne({ _id: target })) as Course

              // console.log(`Document with ID ${document._id} has ended.`)
              if (course.status === OperatingStatus.Inactive) {
                // console.log('status 1:', course?.status)
                // console.log(`Document with ID ${document._id} has ended. 1`)
                await this.courses.findOneAndUpdate(
                  { _id: target },
                  {
                    $set: { status: OperatingStatus.Inactive, notification: null },
                    $currentDate: { updated_at: true }
                  }
                )
                await this.notifications.deleteOne({ _id: document._id }) // Xóa khóa học sau khi đã kết thúc
              } else if (course.status === OperatingStatus.Updating || course.status === OperatingStatus.Active) {
                // console.log(`Document with ID ${document._id} has ended. 2`)
                // console.log('status 2:', course?.status)
                await this.courses.findOneAndUpdate(
                  { _id: target },
                  { $set: { status: OperatingStatus.Active, notification: null }, $currentDate: { updated_at: true } }
                )
                await this.notifications.deleteOne({ _id: document._id }) // Xóa khóa học sau khi đã kết thúc
              }
            })
          }
        } else {
          // Thực hiện các hành động phù hợp với tài liệu đã bắt đầu
          if (document.target_type === TargetType.Course) {
            // Thực hiện các hành động phù hợp với khóa học
            document.targets.forEach(async (target: ObjectId) => {
              // Cap nhat trang thai cua target
              const course = await this.courses.findOne({ _id: target })
              if (!course) {
                this.notifications.deleteOne({ targets: target })
                return
              }

              if (course.status === OperatingStatus.Inactive) {
                // console.log(`Document with ID ${document._id} has started. 1`)
                if (course?.notification !== null) {
                  await this.courses.findOneAndUpdate(
                    { _id: target },
                    { $set: { status: OperatingStatus.Inactive, notification: document._id } }
                  )
                }
                await this.courses.findOneAndUpdate({ _id: target }, { $set: { status: OperatingStatus.Inactive } })
              } else {
                // console.log(`Document with ID ${document._id} has started. 2`)
                if (course?.notification !== null) {
                  await this.courses.findOneAndUpdate(
                    { _id: target },
                    { $set: { status: OperatingStatus.Updating, notification: document._id } }
                  )
                }
                await this.courses.findOneAndUpdate({ _id: target }, { $set: { status: OperatingStatus.Updating } })
              }
            })
          }
        }
      })

      // Kiểm tra xem có bất kỳ notification nào còn tồn tại và chưa hết hạn hay không
      const activeNotificationsCount = await this.notifications.countDocuments({
        end_at: { $gt: currentDate } // Kiểm tra nếu end_at của notification vẫn lớn hơn thời điểm hiện tại
      })

      if (activeNotificationsCount === 0) {
        clearInterval(interval) // Dừng setInterval nếu không còn notification nào chưa hết hạn
        console.log('All notifications have expired. Stopping interval.')
        this.watchTimeFieldsRunning = false // Đặt lại trạng thái của watchTimeFieldsRunning để có thể chạy lại sau này
        return
      }
    }, 30000) // Kiểm tra mỗi 30 giây
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get courses(): Collection<Course> {
    return this.db.collection(envConfig.dbCoursesCollection)
  }

  get tests(): Collection<Test> {
    return this.db.collection(envConfig.dbTestsCollection)
  }

  get questions(): Collection<Question> {
    return this.db.collection(envConfig.dbQuestionsCollection)
  }

  get notifications(): Collection<Notification> {
    return this.db.collection(envConfig.dbNotificationsCollection)
  }
}

// Tạo object từ class DatabaseServices
const databaseServices = new DatabaseServices()
export default databaseServices
