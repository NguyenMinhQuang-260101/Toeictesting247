import { MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@toeictesting247.bcdy1vx.mongodb.net/?retryWrites=true&w=majority&appName=ToeicTesting247`

class DatabaseServices {
  private client: MongoClient

  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }
}

// Tạo object từ class DatabaseServices
const databaseServices = new DatabaseServices()
export default databaseServices
