import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { QuestionContentType, QuestionType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { QUESTIONS_V2_MESSAGES, TESTS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Test_v2 from '~/models/schemas/Test_v2.schema'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const testIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.SOURCE_ID_MUST_NOT_BE_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.TEST_ID_MUST_BE_AN_OBJECT_ID,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      return true
    }
  }
}

const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.TITLE_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: TESTS_MESSAGES.TITLE_MUST_BE_STRING
  }
}

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: TESTS_MESSAGES.DESCRIPTION_MUST_BE_STRING
  }
}

const timelineSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.TIMELINE_MUST_NOT_BE_EMPTY
  },
  isInt: {
    errorMessage: TESTS_MESSAGES.TIMELINE_MUST_BE_A_NUMBER
  }
}

export const createTestValidator_v2 = validate(
  checkSchema(
    {
      title: titleSchema,
      description: descriptionSchema,
      timeline: timelineSchema,
      questions: {
        optional: true,
        isArray: true,
        custom: {
          options: (value, { req }) => {
            // Yêu cầu mỗi phần tử trong mảng phải là question_id
            if (!value.every((item: any) => ObjectId.isValid(item))) {
              throw new Error(TESTS_MESSAGES.QUESTIONS_MUST_BE_AN_ARRAY_OF_QUESTION_ID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const testIdValidator_v2 = validate(
  checkSchema(
    {
      test_id: {
        isMongoId: {
          errorMessage: TESTS_MESSAGES.TEST_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [test] = await databaseServices.tests_v2
              .aggregate<Test_v2>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
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
                  $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    timeline: 1,
                    'questions._id': 1,
                    'questions.type': 1,
                    'questions.type_content': 1,
                    'questions.num_part': 1,
                    'questions.description': 1,
                    'questions.content': 1,
                    'questions.audio_content': 1,
                    'questions.image_content': 1
                  }
                }
              ])
              .toArray()
            if (!test) {
              throw new ErrorWithStatus({
                message: TESTS_MESSAGES.TEST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).test_v2 = test
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const fullTestIdValidator_v2 = validate(
  checkSchema(
    {
      test_id: {
        isMongoId: {
          errorMessage: TESTS_MESSAGES.TEST_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [test] = await databaseServices.tests_v2
              .aggregate<Test_v2>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
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
                  $lookup: {
                    from: 'questions_v2',
                    localField: 'questions._id',
                    foreignField: 'parent_id',
                    as: 'questions.child_questions'
                  }
                },
                {
                  $group: {
                    _id: '$_id',
                    title: {
                      $first: '$title'
                    },
                    description: {
                      $first: '$description'
                    },
                    timeline: {
                      $first: '$timeline'
                    },
                    questions: {
                      $push: {
                        num_part: '$_id.num_part',
                        part: '$questions.items.num_part',
                        items: '$questions'
                      }
                    }
                  }
                },
                {
                  $unwind: '$questions'
                },
                {
                  $set: {
                    'questions.num_part': '$questions.items.num_part'
                  }
                },
                {
                  $group: {
                    _id: '$_id',
                    title: {
                      $first: '$title'
                    },
                    description: {
                      $first: '$description'
                    },
                    timeline: {
                      $first: '$timeline'
                    },
                    questions: {
                      $push: '$questions'
                    }
                  }
                },
                {
                  $unwind: '$questions'
                },
                {
                  $group: {
                    _id: {
                      _id: '$_id',
                      title: '$title',
                      description: '$description',
                      timeline: '$timeline',
                      num_part: '$questions.num_part'
                    },
                    items: {
                      $push: '$questions.items'
                    }
                  }
                },
                {
                  $group: {
                    _id: '$_id._id',
                    title: {
                      $first: '$_id.title'
                    },
                    description: {
                      $first: '$_id.description'
                    },
                    timeline: {
                      $first: '$_id.timeline'
                    },
                    questions: {
                      $push: {
                        num_part: '$_id.num_part',
                        items: '$items'
                      }
                    }
                  }
                },
                {
                  $sort: {
                    'questions.num_part': -1
                  }
                }
              ])
              .toArray()
            if (!test) {
              throw new ErrorWithStatus({
                message: TESTS_MESSAGES.TEST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).test_v2 = test
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

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

export const randomQuestionValidator = validate(
  checkSchema(
    {
      type_question: typeQuestSchema,
      type_content_question: typeContentSchema,
      quantity_questions: {
        notEmpty: {
          errorMessage: QUESTIONS_V2_MESSAGES.QUANTITY_QUESTION_MUST_NOT_BE_EMPTY
        },
        isInt: {
          errorMessage: QUESTIONS_V2_MESSAGES.QUANTITY_QUESTION_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
)

export const testUpdateValidator_v2 = validate(
  checkSchema({
    test_id: testIdSchema,
    title: {
      ...titleSchema,
      optional: true,
      notEmpty: undefined
    },
    description: {
      ...descriptionSchema,
      optional: true,
      notEmpty: undefined
    },
    timeline: {
      ...timelineSchema,
      optional: true,
      notEmpty: undefined
    }
  })
)
