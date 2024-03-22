import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import Course from '~/models/schemas/Course.schema'
import Question from '~/models/schemas/Question.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Test from '~/models/schemas/Test.schema'
import User from '~/models/schemas/User.schema'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@toeictesting247.bcdy1vx.mongodb.net/?retryWrites=true&w=majority&appName=ToeicTesting247`

class DatabaseServices {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
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
}

// Tạo object từ class DatabaseServices
const databaseServices = new DatabaseServices()
export default databaseServices
