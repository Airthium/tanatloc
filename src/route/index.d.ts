/** @module Route */

export interface IRequest<Tbody = {}> {
  method?: string
  query?: {
    id?: string
  }
  params?: {
    id?: string
  }
  cookies?: {
    [key: string]: string
  }
  headers?: {
    cookie: string
  }
  body?: Tbody
  email?: string
}

export interface IResponse {
  setHeader: Function
  status: (value: number) => this
  end: () => this
  json: (value: object) => this
}

export interface IRouteError extends Error {
  status?: number
}
