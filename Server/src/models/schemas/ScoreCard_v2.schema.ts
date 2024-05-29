import { ObjectId } from 'mongodb'

interface ScoreCardConstructor_v2 {
  _id?: ObjectId
  user_id: ObjectId
  test_id: ObjectId
  questions?: ObjectId[]
  total_correct?: number
  total_marks?: number
  total_time: number
  created_at?: Date
}

export default class ScoreCard_v2 {
  _id?: ObjectId
  user_id: ObjectId
  test_id: ObjectId
  questions: ObjectId[]
  total_correct: number
  total_marks: number
  total_time: number
  created_at: Date

  constructor({
    _id,
    user_id,
    test_id,
    questions,
    total_correct,
    total_marks,
    total_time,
    created_at
  }: ScoreCardConstructor_v2) {
    this._id = _id
    this.user_id = user_id
    this.test_id = test_id
    this.questions = questions || []
    this.total_correct = total_correct || 0
    this.total_marks = total_marks || 0
    this.total_time = total_time
    this.created_at = created_at || new Date()
  }
}
