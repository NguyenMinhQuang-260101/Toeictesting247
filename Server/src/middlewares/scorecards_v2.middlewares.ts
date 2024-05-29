import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { SCORECARDS_MESSAGES, SCORECARDS_MESSAGES_v2 } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import ScoreCard from '~/models/schemas/ScoreCard.schema'
import databaseServices from '~/services/database.services'
import { validate } from '~/utils/validation'

export const crateScoreCardValidator_v2 = validate(
  checkSchema({
    total_time: {
      notEmpty: {
        errorMessage: SCORECARDS_MESSAGES.TOTAL_TIME_MUST_NOT_BE_EMPTY
      },
      isNumeric: {
        errorMessage: SCORECARDS_MESSAGES.TOTAL_TIME_MUST_BE_A_NUMBER
      }
    },
    questions: {
      isArray: {
        errorMessage: SCORECARDS_MESSAGES.QUESTIONS_MUST_BE_AN_ARRAY
      }
    },
    'questions.*.num_part': {
      notEmpty: {
        errorMessage: SCORECARDS_MESSAGES_v2.NUM_PART_MUST_NOT_BE_EMPTY
      },
      isInt: {
        errorMessage: SCORECARDS_MESSAGES_v2.NUM_PART_MUST_BE_A_NUMBER
      }
    },
    'questions.*.items': {
      notEmpty: {
        errorMessage: SCORECARDS_MESSAGES_v2.ITEMS_MUST_NOT_BE_EMPTY
      },
      isArray: {
        errorMessage: SCORECARDS_MESSAGES_v2.ITEMS_MUST_BE_AN_ARRAY
      }
    }
    // 'questions.*.num_quest': {
    //   notEmpty: {
    //     errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_NOT_BE_EMPTY
    //   },
    //   isInt: {
    //     errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_BE_A_NUMBER
    //   }
    // },
    // 'questions.*.description': {
    //   notEmpty: {
    //     errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
    //   },
    //   isString: {
    //     errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_BE_STRING
    //   }
    // },
    // 'questions.*.content': {
    //   notEmpty: {
    //     errorMessage: QUESTIONS_MESSAGES.CONTENT_MUST_NOT_BE_EMPTY
    //   },
    //   custom: {
    //     options: (value, { req }) => {
    //       if (typeof value === 'string') {
    //         // Kiểm tra nếu giá trị là một chuỗi hoặc một mảng
    //         return true
    //       } else if (
    //         Array.isArray(value) &&
    //         value.every((item: any) => typeof item.url === 'string' && mediaTypes.includes(item.type))
    //       ) {
    //         return true
    //       } else {
    //         throw new Error(QUESTIONS_MESSAGES.CONTENT_MUST_BE_STRING_OR_MEDIA_OBJECT)
    //       }
    //     }
    //   }
    // },
    // 'questions.*.answers': {
    //   notEmpty: {
    //     errorMessage: QUESTIONS_MESSAGES.ANSWERS_MUST_NOT_BE_EMPTY
    //   },
    //   isArray: true,
    //   custom: {
    //     options: (value, { req }) => {
    //       if (
    //         value.some((item: Answer) => {
    //           return typeof item.order_answer !== 'string' || typeof item.content_answer !== 'string'
    //         })
    //       ) {
    //         throw new Error(QUESTIONS_MESSAGES.ANSWERS_MUST_BE_AN_ARRAY_OF_ANSWER_OBJECT)
    //       }
    //       return true
    //     }
    //   }
    // },
    // 'questions.*.correct_at': {
    //   notEmpty: {
    //     errorMessage: QUESTIONS_MESSAGES.CORRECT_AT_MUST_NOT_BE_EMPTY
    //   },
    //   custom: {
    //     options: (value, { req }) => {
    //       if (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string') {
    //         throw new Error(QUESTIONS_MESSAGES.CORRECT_AT_MUST_BE_AN_ANSWER_OBJECT)
    //       }
    //       return true
    //     }
    //   }
    // },
    // 'questions.*.selected_at': {
    //   optional: true,
    //   custom: {
    //     options: (value, { req }) => {
    //       if (value !== null && (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string')) {
    //         throw new Error(QUESTIONS_MESSAGES.SELECTED_AT_MUST_BE_AN_ANSWER_OBJECT)
    //       }
    //       return true
    //     }
    //   }
    // },
    // 'questions.*.score': {
    //   notEmpty: {
    //     errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_NOT_BE_EMPTY
    //   },
    //   isInt: {
    //     errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_BE_A_NUMBER
    //   }
    // }
  })
)

export const scoreCardIdValidator_v2 = validate(
  checkSchema(
    {
      scorecard_id: {
        isMongoId: {
          errorMessage: SCORECARDS_MESSAGES.SCORECARD_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [scoreCard] = await databaseServices.scorecards
              .aggregate<ScoreCard>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
                  }
                },
                {
                  $lookup: {
                    from: 'questions',
                    localField: 'questions',
                    foreignField: '_id',
                    as: 'questions'
                  }
                },
                {
                  $addFields: {
                    total_question: {
                      $size: '$questions'
                    }
                  }
                }
              ])
              .toArray()
            if (!scoreCard) {
              throw new ErrorWithStatus({
                message: SCORECARDS_MESSAGES.SCORECARD_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).scorecard = scoreCard
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)
