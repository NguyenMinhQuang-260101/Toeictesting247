import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)

    // Nếu không có lỗi thì chạy tiếp
    if (errors.isEmpty()) {
      return next()
    }

    const errorObjects = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObjects) {
      const { msg } = errorObjects[key]
      // Trả về lỗi nếu không phải là lỗi validation
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorObjects[key]
    }

    next(entityError)
  }
}
