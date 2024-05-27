import { ObjectId } from 'mongodb'
import { QuestionContentType, QuestionType } from '~/constants/enums'
import { Answer } from '../Other'

interface QuestionConstructor_v2 {
  _id?: ObjectId
  type: QuestionType
  type_content: QuestionContentType
  num_part: number
  description: string
  content: string
  audio_content?: string
  image_content?: string
  answers: Answer[]
  correct_at?: Answer
  selected_at?: Answer
  score: number
  parent_id: null | ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Question_v2 {
  _id?: ObjectId
  type: QuestionType
  type_content: QuestionContentType
  num_part: number
  description: string
  content: string
  audio_content: null | string
  image_content: null | string
  answers: Answer[]
  correct_at: null | Answer
  selected_at: null | Answer
  score: number
  parent_id: null | ObjectId
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    type,
    type_content,
    num_part,
    description,
    content,
    audio_content,
    image_content,
    answers,
    correct_at,
    selected_at,
    score,
    parent_id,
    created_at,
    updated_at
  }: QuestionConstructor_v2) {
    const date = new Date()
    this._id = _id
    this.type = type
    this.type_content = type_content
    this.num_part = num_part
    this.description = description
    this.content = content
    this.audio_content = audio_content || null
    this.image_content = image_content || null
    this.answers = answers || []
    this.correct_at = correct_at || null
    this.selected_at = selected_at || null
    this.score = score
    this.parent_id = parent_id || null
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}

// ) {
//     const date = new Date()
//     this._id = _id
//     this.test_id = test_id
//     this.num_quest = num_quest
//     this.description = description
//     this.content = content
//     this.answers = answers
//     this.correct_at = correct_at || null
//     this.selected_at = selected_at || null
//     this.score = score
//     this.created_at = created_at || date
//     this.updated_at = updated_at || date
//   }
// }
