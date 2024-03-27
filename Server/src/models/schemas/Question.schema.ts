import { Answer, Media } from './../Other'
import { ObjectId } from 'mongodb'

interface QuestionConstructor {
  _id?: ObjectId
  test_id: ObjectId
  num_quest: number
  description: string
  content: string | Media[]
  answers: Answer[]
  correct_at?: Answer
  selected_at?: Answer
  score: number
  created_at?: Date
  updated_at?: Date
}

export default class Question {
  _id?: ObjectId
  test_id: ObjectId
  num_quest: number
  description: string
  content: string | Media[]
  answers: Answer[]
  correct_at: null | Answer
  selected_at: null | Answer
  score: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    test_id,
    num_quest,
    description,
    content,
    answers,
    correct_at,
    selected_at,
    score,
    created_at,
    updated_at
  }: QuestionConstructor) {
    const date = new Date()
    this._id = _id
    this.test_id = test_id
    this.num_quest = num_quest
    this.description = description
    this.content = content
    this.answers = answers
    this.correct_at = correct_at || null
    this.selected_at = selected_at || null
    this.score = score
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
