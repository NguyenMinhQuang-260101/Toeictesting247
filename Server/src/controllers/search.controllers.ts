import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { SearchCourseQuery } from '~/models/requests/Search.requests'
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
