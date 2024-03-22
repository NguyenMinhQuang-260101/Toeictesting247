import { MediaType } from '~/constants/enums'

export interface Media {
  url: string
  type: MediaType
}

export interface Answer {
  order_answer: string
  content_answer: string
}
