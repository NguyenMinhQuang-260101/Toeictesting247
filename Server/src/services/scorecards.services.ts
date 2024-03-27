import { ObjectId } from 'mongodb'
import { ScoreCardReqBody } from '~/models/requests/ScoreCard.requests'
import Question from '~/models/schemas/Question.schema'
import ScoreCard from '~/models/schemas/ScoreCard.schema'
import { Answer } from './../models/Other'
import databaseServices from './database.services'

class ScoreCardService {
  async createScoreCard(user_id: string, body: ScoreCardReqBody) {
    const checkExistScoreCard = await databaseServices.scorecards.findOne({
      user_id: new ObjectId(user_id),
      test_id: new ObjectId(body.test_id)
    })
    if (checkExistScoreCard) {
      await Promise.all([
        await databaseServices.scorecards.deleteOne({
          user_id: new ObjectId(user_id),
          test_id: new ObjectId(body.test_id)
        }),
        await databaseServices.questions.deleteMany({
          test_id: checkExistScoreCard._id
        })
      ])
    }

    const _scoreCard = await databaseServices.scorecards.insertOne(
      new ScoreCard({
        user_id: new ObjectId(user_id),
        test_id: new ObjectId(body.test_id),
        total_time: body.total_time
      })
    )

    // total_correct: Tổng số câu trả lời đúng
    // total_marks: Tổng số điểm
    // questionIds: Mảng chứa id của các câu hỏi
    const scoreCardId = _scoreCard.insertedId
    let total_correct = 0 as number
    let total_marks = 0 as number
    const questionIds = [] as ObjectId[]
    for (const question of body.questions) {
      if (question.selected_at) {
        if (
          question.selected_at.order_answer === question.correct_at?.order_answer &&
          question.selected_at.content_answer === question.correct_at?.content_answer
        ) {
          total_correct++
          total_marks += question.score
          const _question = await databaseServices.questions.insertOne(
            new Question({
              test_id: scoreCardId,
              num_quest: question.num_quest,
              description: question.description,
              content: question.content,
              answers: question.answers.map((answer: Answer) => ({
                order_answer: answer.order_answer,
                content_answer: answer.content_answer
              })),
              selected_at: question.selected_at,
              score: question.score
            })
          )
          questionIds.push(_question.insertedId)
        } else {
          total_correct
          total_marks
          const _question = await databaseServices.questions.insertOne(
            new Question({
              test_id: scoreCardId,
              num_quest: question.num_quest,
              description: question.description,
              content: question.content,
              answers: question.answers.map((answer: Answer) => ({
                order_answer: answer.order_answer,
                content_answer: answer.content_answer
              })),
              correct_at: question.correct_at as Answer,
              selected_at: question.selected_at,
              score: question.score
            })
          )
          questionIds.push(_question.insertedId)
        }
      } else {
        total_correct
        total_marks
        const _question = await databaseServices.questions.insertOne(
          new Question({
            test_id: scoreCardId,
            num_quest: question.num_quest,
            description: question.description,
            content: question.content,
            answers: question.answers.map((answer: Answer) => ({
              order_answer: answer.order_answer,
              content_answer: answer.content_answer
            })),
            correct_at: question.correct_at as Answer,
            score: question.score
          })
        )
        questionIds.push(_question.insertedId)
      }
    }

    const scoreCard = await databaseServices.scorecards.findOneAndUpdate(
      { _id: scoreCardId },
      {
        $set: {
          total_correct,
          total_marks,
          questions: questionIds
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return scoreCard
  }
}

const scoreCardService = new ScoreCardService()
export default scoreCardService
