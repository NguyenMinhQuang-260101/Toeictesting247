import { SearchCourseQuery } from '~/models/requests/Search.requests'
import databaseServices from './database.services'
import Course from '~/models/schemas/Course.schema'
import {
  CourseType,
  CourseTypeQuery,
  DocumentType,
  DocumentTypeQuery,
  QuestionContentType,
  QuestionContentTypeQuery,
  QuestionType,
  QuestionTypeQuery
} from '~/constants/enums'
import Document from '~/models/schemas/Document.schema'
import User from '~/models/schemas/User.schema'
import Question_v2 from '~/models/schemas/Question_v2.schema'

class SearchService {
  async searchCourse({
    limit,
    page,
    title,
    course_type_query
  }: {
    limit: number
    page: number
    title: string
    course_type_query: CourseTypeQuery
  }) {
    const $match: any = {
      $text: {
        $search: title
      }
    }

    if (course_type_query) {
      if (course_type_query === CourseTypeQuery.Full) {
        $match['type'] = CourseType.Full
      }
      if (course_type_query === CourseTypeQuery.Listening) {
        $match['type'] = CourseType.Listening
      }
      if (course_type_query === CourseTypeQuery.Reading) {
        $match['type'] = CourseType.Reading
      }
    }

    const [courses, total] = await Promise.all([
      databaseServices.courses
        .aggregate<Course>([
          {
            $match
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.courses.countDocuments($match)
    ])

    return {
      courses,
      total
    }
  }

  async searchDocument({
    limit,
    page,
    title,
    document_type_query
  }: {
    limit: number
    page: number
    title: string
    document_type_query: DocumentTypeQuery
  }) {
    const $match: any = {
      $text: {
        $search: title
      }
    }

    if (document_type_query) {
      if (document_type_query === DocumentTypeQuery.Grammar) {
        $match['type'] = DocumentType.Grammar
      }
      if (document_type_query === DocumentTypeQuery.Vocabulary) {
        $match['type'] = DocumentType.Vocabulary
      }
    }

    const [documents, total] = await Promise.all([
      databaseServices.documents
        .aggregate<Document>([
          {
            $match
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.documents.countDocuments($match)
    ])

    return {
      documents,
      total
    }
  }

  async searchUser({ limit, page, name_email }: { limit: number; page: number; name_email: string }) {
    const $match: any = {
      $text: {
        $search: name_email
      }
    }

    const [users, total] = await Promise.all([
      databaseServices.users
        .aggregate<User>([
          {
            $match
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.users.countDocuments($match)
    ])

    return {
      users,
      total
    }
  }

  async searchQuestion({
    limit,
    page,
    question_type,
    question_content_type,
    num_part
  }: {
    limit: number
    page: number
    question_type: string
    question_content_type: string
    num_part: number
  }) {
    const $match: any = {}
    if (question_type) {
      if (question_type === QuestionTypeQuery.SimpleQuestion) {
        $match['type'] = QuestionType.SimpleQuestion
      }
      if (question_type === QuestionTypeQuery.DoubleQuestion) {
        $match['type'] = QuestionType.DoubleQuestion
      }
      if (question_type === QuestionTypeQuery.TripleQuestion) {
        $match['type'] = QuestionType.TripleQuestion
      }
      if (question_type === QuestionTypeQuery.QuadrupleQuestion) {
        $match['type'] = QuestionType.QuadrupleQuestion
      }
      if (question_type === QuestionTypeQuery.QuintupleQuestion) {
        $match['type'] = QuestionType.QuintupleQuestion
      }
    }

    if (question_content_type) {
      if (question_content_type === QuestionContentTypeQuery.Listening) {
        $match['type_content'] = QuestionContentType.Listening
      }
      if (question_content_type === QuestionContentTypeQuery.Reading) {
        $match['type_content'] = QuestionContentType.Reading
      }
    }

    if (num_part) {
      $match['num_part'] = num_part
    }

    const [questions, total] = await Promise.all([
      databaseServices.questions_v2
        .aggregate<Question_v2>([
          {
            $match
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.questions_v2.countDocuments($match)
    ])

    return {
      questions,
      total
    }
  }
}

const searchService = new SearchService()
export default searchService
