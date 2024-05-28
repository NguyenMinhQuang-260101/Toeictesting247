import { ObjectId } from 'mongodb'

interface TestConstructor_v2 {
  _id?: ObjectId
  title: string
  description: string
  timeline: number
  questions: string[] | []
  created_at?: Date
  updated_at?: Date
}

export default class Test_v2 {
  _id?: ObjectId
  title: string
  description: string
  timeline: number
  questions: ObjectId[]
  created_at: Date
  updated_at: Date
  constructor({ _id, title, description, timeline, questions, created_at, updated_at }: TestConstructor_v2) {
    const date = new Date()
    this._id = _id
    this.title = title
    this.description = description
    this.timeline = timeline
    this.questions = questions ? questions.map((question) => new ObjectId(question)) : []
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
