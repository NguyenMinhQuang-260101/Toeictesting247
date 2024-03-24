import { ObjectId } from 'mongodb'

interface TestConstructor {
  _id?: ObjectId
  source_id: ObjectId
  title: string
  description: string
  timeline: number
  questions: string[]
  created_at?: Date
  updated_at?: Date
}

export default class Test {
  _id?: ObjectId
  source_id: ObjectId
  title: string
  description: string
  timeline: number
  questions: ObjectId[]
  created_at: Date
  updated_at: Date
  constructor({ _id, source_id, title, description, timeline, questions, created_at, updated_at }: TestConstructor) {
    const date = new Date()
    this._id = _id
    this.source_id = source_id
    this.title = title
    this.description = description
    this.timeline = timeline
    this.questions = questions.map((item) => new ObjectId(item))
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
