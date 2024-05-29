import Question_v2 from '../schemas/Question_v2.schema'

export interface ScoreCardReqBody_v2 {
  user_id: string
  test_id: string
  questions: PartQuestion[]
  total_time: number
}

interface PartQuestion {
  num_part: number
  items: QuestionReqBodyScoreCard[]
}

interface QuestionReqBodyScoreCard extends Question_v2 {
  child_questions: Question_v2[]
}
