export interface IRequest {
  email?: string
  cookies: string
  headers: {
    cookie: string
  }
}

export interface IResponse {
  setHeader: Function
  status: (value: number) => this
  end: () => this
  json: (value: object) => this
}
