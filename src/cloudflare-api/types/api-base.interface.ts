export interface CFResponseError {
  code: number
  message: string
}

export interface CFRequestPaginationParams {
  // Page number of paginated results
  page?: number

  // Number of results per page
  per_page?: number

  // Field to sort results by
  order?: string

  // Direction to sort results by
  direction?: "ASC" | "DESC"
}

export interface CFPaginationResponse {
  page: number
  per_page: number
  count: number
  total_count: number
}

export interface CFDefaultResponse {
  success: boolean
  errors: CFResponseError[]
  messages: string[]
  result: unknown
  result_info?: CFPaginationResponse
}
