import { ObjectId } from 'mongodb'
import { ScoreCardReqBody_v2 } from '~/models/requests/ScoreCard_v2.requests'
import Question_v2 from '~/models/schemas/Question_v2.schema'
import ScoreCard_v2 from '~/models/schemas/ScoreCard_v2.schema'
import { Answer } from '../models/Other'
import databaseServices from './database.services'

class ScoreCardService_v2 {
  async createScoreCard_v2(user_id: string, body: ScoreCardReqBody_v2) {
    const checkExistScoreCard = await databaseServices.scorecards_v2.findOne({
      user_id: new ObjectId(user_id),
      test_id: new ObjectId(body.test_id)
    })

    if (checkExistScoreCard) {
      for (const questionId of checkExistScoreCard.questions) {
        const countQuestionId = await databaseServices.questions_v2.countDocuments({ parent_id: questionId })
        if (countQuestionId > 0) {
          await databaseServices.questions_v2.deleteMany({ parent_id: questionId })
        }
      }
      await Promise.all([
        databaseServices.scorecards_v2.deleteOne({
          user_id: new ObjectId(user_id),
          test_id: new ObjectId(body.test_id)
        }),
        databaseServices.questions_v2.deleteMany({ _id: { $in: checkExistScoreCard.questions } })
      ])
    }

    const _scoreCard = await databaseServices.scorecards_v2.insertOne(
      new ScoreCard_v2({
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
    for (const part of body.questions) {
      for (const question of part.items) {
        /* CASE_01: QUESTION IS PARENT AND HAVE CHILD QUESTION */
        if (question.child_questions.length > 0) {
          const parent_question = await databaseServices.questions_v2.insertOne(
            new Question_v2({
              type: question.type,
              type_content: question.type_content,
              num_part: part.num_part,
              description: question.description,
              content: question.content,
              audio_content: question.audio_content as string,
              image_content: question.image_content as string,
              answers: [],
              score: question.score,
              parent_id: null
            })
          )
          questionIds.push(parent_question.insertedId)

          for (const childQuestion of question.child_questions) {
            if (childQuestion.selected_at) {
              if (
                childQuestion.selected_at.order_answer === childQuestion.correct_at?.order_answer &&
                childQuestion.selected_at.content_answer === childQuestion.correct_at?.content_answer
              ) {
                total_correct++
                total_marks += childQuestion.score
                await databaseServices.questions_v2.insertOne(
                  new Question_v2({
                    type: childQuestion.type,
                    type_content: childQuestion.type_content,
                    num_part: part.num_part,
                    description: childQuestion.description,
                    content: childQuestion.content,
                    audio_content: childQuestion.audio_content as string,
                    image_content: childQuestion.image_content as string,
                    answers: childQuestion.answers,
                    correct_at: childQuestion.correct_at,
                    selected_at: childQuestion.selected_at,
                    score: childQuestion.score,
                    parent_id: parent_question.insertedId
                  })
                )
              } else {
                total_correct
                total_marks
                await databaseServices.questions_v2.insertOne(
                  new Question_v2({
                    type: childQuestion.type,
                    type_content: childQuestion.type_content,
                    num_part: part.num_part,
                    description: childQuestion.description,
                    content: childQuestion.content,
                    audio_content: childQuestion.audio_content as string,
                    image_content: childQuestion.image_content as string,
                    answers: childQuestion.answers,
                    correct_at: childQuestion.correct_at as Answer,
                    selected_at: childQuestion.selected_at,
                    score: childQuestion.score,
                    parent_id: parent_question.insertedId
                  })
                )
              }
            } else {
              total_correct
              total_marks
              await databaseServices.questions_v2.insertOne(
                new Question_v2({
                  type: childQuestion.type,
                  type_content: childQuestion.type_content,
                  num_part: part.num_part,
                  description: childQuestion.description,
                  content: childQuestion.content,
                  audio_content: childQuestion.audio_content as string,
                  image_content: childQuestion.image_content as string,
                  answers: childQuestion.answers,
                  correct_at: childQuestion.correct_at as Answer,
                  score: childQuestion.score,
                  parent_id: parent_question.insertedId
                })
              )
            }
          }
        } else {
          /* CASE_02: QUESTION IS SIMPLE QUESTION */
          if (question.selected_at) {
            if (
              question.selected_at.order_answer === question.correct_at?.order_answer &&
              question.selected_at.content_answer === question.correct_at?.content_answer
            ) {
              total_correct++
              total_marks += question.score
              const _question = await databaseServices.questions_v2.insertOne(
                new Question_v2({
                  type: question.type,
                  type_content: question.type_content,
                  num_part: part.num_part,
                  description: question.description,
                  content: question.content,
                  audio_content: question.audio_content as string,
                  image_content: question.image_content as string,
                  answers: question.answers,
                  selected_at: question.selected_at,
                  score: question.score,
                  parent_id: null
                })
              )
              questionIds.push(_question.insertedId)
            } else {
              total_correct
              total_marks
              const _question = await databaseServices.questions_v2.insertOne(
                new Question_v2({
                  type: question.type,
                  type_content: question.type_content,
                  num_part: part.num_part,
                  description: question.description,
                  content: question.content,
                  audio_content: question.audio_content as string,
                  image_content: question.image_content as string,
                  answers: question.answers,
                  correct_at: question.correct_at as Answer,
                  selected_at: question.selected_at,
                  score: question.score,
                  parent_id: null
                })
              )
              questionIds.push(_question.insertedId)
            }
          } else {
            total_correct
            total_marks
            const _question = await databaseServices.questions_v2.insertOne(
              new Question_v2({
                type: question.type,
                type_content: question.type_content,
                num_part: part.num_part,
                description: question.description,
                content: question.content,
                audio_content: question.audio_content as string,
                image_content: question.image_content as string,
                answers: question.answers,
                correct_at: question.correct_at as Answer,
                score: question.score,
                parent_id: null
              })
            )
            questionIds.push(_question.insertedId)
          }
        }
      }
    }

    const scoreCard = await databaseServices.scorecards_v2.findOneAndUpdate(
      { _id: scoreCardId },
      {
        $set: {
          total_correct,
          total_marks,
          questions: questionIds
        }
      },
      { returnDocument: 'after' }
    )

    return scoreCard
  }

  async getScoreCardController_v2(user_id: string, test_id: string) {
    const [scoreCard] = await databaseServices.scorecards_v2
      .aggregate<ScoreCard_v2>([
        {
          $match: {
            user_id: new ObjectId(user_id),
            test_id: new ObjectId(test_id)
          }
        },
        {
          $lookup: {
            from: 'questions_v2',
            localField: 'questions',
            foreignField: '_id',
            as: 'questions'
          }
        },
        {
          $unwind: '$questions'
        },
        {
          $sort: {
            'questions.num_part': 1
          }
        },
        {
          $lookup: {
            from: 'questions_v2',
            localField: 'questions._id',
            foreignField: 'parent_id',
            as: 'questions.child_questions'
          }
        },
        {
          $group: {
            _id: '$user_id',
            test_id: {
              $first: '$test_id'
            },
            questions: {
              $push: {
                question: '$questions'
              }
            },
            total_correct: {
              $first: '$total_correct'
            },
            total_marks: {
              $first: '$total_marks'
            },
            total_time: {
              $first: '$total_time'
            },
            created_at: {
              $first: '$created_at'
            }
          }
        }
      ])
      .toArray()

    if (!scoreCard) {
      throw new Error('ScoreCard not found')
    }

    return scoreCard
  }
}

const scoreCardService_v2 = new ScoreCardService_v2()
export default scoreCardService_v2
