import { Answer, Media } from '../Other'

export interface QuestionReqBody {
  test_id: string
  num_quest: number
  description: string
  content: string | Media[]
  answers: Answer[]
  correct_at: Answer
  selected_at?: Answer
  score: number
}
