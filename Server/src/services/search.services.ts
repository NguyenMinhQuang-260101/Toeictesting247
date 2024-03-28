import { SearchCourseQuery } from '~/models/requests/Search.requests'
import databaseServices from './database.services'
import Course from '~/models/schemas/Course.schema'
import { CourseType, CourseTypeQuery, DocumentType, DocumentTypeQuery } from '~/constants/enums'
import Document from '~/models/schemas/Document.schema'

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
}

const searchService = new SearchService()
export default searchService
