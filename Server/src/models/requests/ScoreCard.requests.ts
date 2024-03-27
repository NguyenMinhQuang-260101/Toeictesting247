import Question from '../schemas/Question.schema'

export interface ScoreCardReqBody {
  user_id: string
  test_id: string
  questions: Question[]
  total_time: number
}
