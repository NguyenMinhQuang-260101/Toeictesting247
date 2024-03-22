import { Answer, Media } from './../Other'
import { ObjectId } from 'mongodb'

interface QuestionConstructor {
  _id?: ObjectId
  test_id: ObjectId
  num_quest: number
  description: string
  content: string | Media[]
  answers: Answer[]
  correct_at: Answer
  selected_at?: Answer
  score: number
}

export default class Question {
  _id?: ObjectId
  test_id: ObjectId
  num_quest: number
  description: string
  content: string | Media[]
  answers: Answer[]
  correct_at: Answer
  selected_at: null | Answer
  score: number
  constructor({
    _id,
    test_id,
    num_quest,
    description,
    content,
    answers,
    correct_at,
    selected_at,
    score
  }: QuestionConstructor) {
    this._id = _id
    this.test_id = test_id
    this.num_quest = num_quest
    this.description = description
    this.content = content
    this.answers = answers
    this.correct_at = correct_at
    this.selected_at = selected_at || null
    this.score = score
  }
}
