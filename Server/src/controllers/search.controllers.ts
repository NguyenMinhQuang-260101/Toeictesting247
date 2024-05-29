import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import {
  SearchCourseQuery,
  SearchDocumentQuery,
  SearchQuestionReqQuery,
  SearchUserReqQuery
} from '~/models/requests/Search.requests'
import searchService from '~/services/search.services'

export const searchCourseController = async (
  req: Request<ParamsDictionary, any, any, SearchCourseQuery>,
  res: Response
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { total, courses } = await searchService.searchCourse({
    limit,
    page,
    title: req.query.title,
    course_type_query: req.query.course_type_query
  })
  return res.json({
    message: 'Search course successfully',
    result: {
      courses,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const searchDocumentController = async (
  req: Request<ParamsDictionary, any, any, SearchDocumentQuery>,
  res: Response
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { total, documents } = await searchService.searchDocument({
    limit,
    page,
    title: req.query.title,
    document_type_query: req.query.document_type_query
  })
  return res.json({
    message: 'Search document successfully',
    result: {
      documents,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const searchUserController = async (
  req: Request<ParamsDictionary, any, any, SearchUserReqQuery>,
  res: Response
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { total, users } = await searchService.searchUser({
    limit,
    page,
    name_email: req.query.name_email
  })
  return res.json({
    message: 'Search user successfully',
    result: {
      users,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const searchQuestionController = async (
  req: Request<ParamsDictionary, any, any, SearchQuestionReqQuery>,
  res: Response
) => {
  const num_part = Number(req.query.num_part)
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { total, questions } = await searchService.searchQuestion({
    num_part,
    question_type: req.query.question_type,
    question_content_type: req.query.question_content_type,
    limit,
    page
  })
  return res.json({
    message: 'Search questions successfully',
    result: {
      questions,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}
