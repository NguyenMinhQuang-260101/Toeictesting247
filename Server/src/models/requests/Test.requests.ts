export interface TestReqBody {
  source_id: string
  title: string
  description: string
  timeline: number
  questions: string[]
}

export interface UpdateTestReqBody {
  test_id: string
  source_id: string
  title?: string
  description?: string
  timeline?: number
}
