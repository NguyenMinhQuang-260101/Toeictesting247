import { DocumentType, OperatingStatus } from '~/constants/enums'
import { Media } from '../Other'
import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface DocumentReqBody {
  type: DocumentType
  title: string
  description: string
  content: string
  tests: string[]
  thumbnails: Media[]
  notification: null | string
  status: OperatingStatus
}

export interface UpdateDocumentReqBody {
  document_id: string
  type?: DocumentType
  title?: string
  description?: string
  content?: string
  thumbnails?: Media[]
  status?: OperatingStatus
}

export interface DocumentParams extends ParamsDictionary {
  document_id: string
}

export interface DocumentQuery extends Query {
  limit: string
  page: string
  document_type: string
}
