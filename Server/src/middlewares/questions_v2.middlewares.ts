import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { QuestionContentType, QuestionContentTypeQuery, QuestionType, QuestionTypeQuery } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { QUESTIONS_MESSAGES, QUESTIONS_MESSAGES_V2, QUESTIONS_V2_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Question_v2 from '~/models/schemas/Question_v2.schema'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const questionTypes = numberEnumToArray(QuestionType)
const questionContentTypes = numberEnumToArray(QuestionContentType)

const typeQuestSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_V2_MESSAGES.TYPE_QUEST_MUST_NOT_BE_EMPTY
  },
  isIn: {
    options: [questionTypes],
    errorMessage: QUESTIONS_V2_MESSAGES.TYPE_QUEST_INVALID
  }
}

const typeContentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_V2_MESSAGES.TYPE_CONTENT_MUST_NOT_BE_EMPTY
  },
  isIn: {
    options: [questionContentTypes],
    errorMessage: QUESTIONS_V2_MESSAGES.TYPE_CONTENT_INVALID
  }
}

const partQuestSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_V2_MESSAGES.PART_QUEST_MUST_NOT_BE_EMPTY
  },
  isInt: {
    errorMessage: QUESTIONS_V2_MESSAGES.PART_QUEST_MUST_BE_A_NUMBER
  }
}

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_BE_STRING
  }
}

const contentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.CONTENT_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: QUESTIONS_MESSAGES.CONTENT_MUST_BE_STRING
  }
}

const answerSchema: ParamSchema = {
  custom: {
    options: (value, { req }) => {
      if (
        req.body.type === QuestionType.SimpleQuestion &&
        req.body.type === QuestionType.QuoteQuestion &&
        value.some((item: any) => {
          return typeof item.order_answer !== 'string' || typeof item.content_answer !== 'string'
        })
      ) {
        throw new Error(QUESTIONS_MESSAGES.ANSWERS_MUST_BE_AN_ARRAY_OF_ANSWER_OBJECT)
      }
      return true
    }
  }
}

const correctAtSchema: ParamSchema = {
  custom: {
    options: (value, { req }) => {
      if (req.body.type === QuestionType.SimpleQuestion || req.body.type === QuestionType.QuoteQuestion) {
        if (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string') {
          throw new Error(QUESTIONS_MESSAGES.CORRECT_AT_MUST_BE_AN_ANSWER_OBJECT)
        }
      }
      return true
    }
  }
}

const selectedAtSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.SELECTED_AT_MUST_NOT_BE_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      if (value !== null && (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string')) {
        throw new Error(QUESTIONS_MESSAGES.SELECTED_AT_MUST_BE_AN_ANSWER_OBJECT)
      }
      return true
    }
  }
}

const scoreSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_NOT_BE_EMPTY
  },
  isInt: {
    errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_BE_A_NUMBER
  }
}

const parentIdQuestSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_V2_MESSAGES.PARENT_ID_QUEST_MUST_NOT_BE_EMPTY
  },
  isMongoId: {
    errorMessage: QUESTIONS_V2_MESSAGES.PARENT_ID_QUEST_INVALID
  }
}

export const createQuestionValidator_v2 = validate(
  checkSchema(
    {
      type: typeQuestSchema,
      type_content: typeContentSchema,
      num_part: partQuestSchema,
      description: {
        ...descriptionSchema,
        optional: true,
        notEmpty: undefined
      },
      content: contentSchema,
      audio_content: {
        ...contentSchema,
        optional: true,
        notEmpty: undefined
      },
      image_content: {
        ...contentSchema,
        optional: true,
        notEmpty: undefined
      },
      answers: answerSchema,
      correct_at: correctAtSchema,
      selected_at: {
        ...selectedAtSchema,
        optional: true,
        notEmpty: undefined
      },
      score: scoreSchema,
      parent_id: {
        ...parentIdQuestSchema,
        optional: true,
        notEmpty: undefined
      }
    },
    ['body']
  )
)

export const questionIdValidator_v2 = validate(
  checkSchema(
    {
      question_id: {
        isMongoId: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [question] = await databaseServices.questions_v2
              .aggregate<Question_v2>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
                  }
                },
                {
                  $lookup: {
                    from: 'questions_v2',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'child_questions'
                  }
                }
              ])
              .toArray()
            if (!question) {
              throw new ErrorWithStatus({
                message: QUESTIONS_MESSAGES.QUESTION_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).question_v2 = question
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const updateQuestionValidator_v2 = validate(
  checkSchema(
    {
      description: {
        ...descriptionSchema,
        optional: true,
        notEmpty: undefined
      },
      content: {
        ...contentSchema,
        optional: true,
        notEmpty: undefined
      },
      audio_content: {
        ...contentSchema,
        optional: true,
        notEmpty: undefined
      },
      image_content: {
        ...contentSchema,
        optional: true,
        notEmpty: undefined
      },
      answers: {
        ...answerSchema,
        optional: true
      },
      correct_at: {
        ...correctAtSchema,
        optional: true
      },
      selected_at: {
        ...selectedAtSchema,
        optional: true,
        notEmpty: undefined
      },
      score: {
        ...scoreSchema,
        optional: true,
        notEmpty: undefined
      }
    },
    ['body']
  )
)

export const searchQuestionValidator = validate(
  checkSchema(
    {
      question_type: {
        optional: true,
        isIn: {
          options: [Object.values(QuestionTypeQuery)],
          errorMessage: QUESTIONS_MESSAGES_V2.TYPE_MUST_BE_IN_ENUM_VALUES_QUESTION_TYPE
        }
      },
      question_content_type: {
        optional: true,
        isIn: {
          options: [Object.values(QuestionContentTypeQuery)],
          errorMessage: QUESTIONS_MESSAGES_V2.TYPE_CONTENT_MUST_BE_IN_ENUM_VALUES_QUESTION_CONTENT_TYPE
        }
      },
      num_part: {
        optional: true,
        isNumeric: true
      }
    },
    ['query']
  )
)
