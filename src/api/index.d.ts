import { IProject } from '@/database'

export interface IFetchResponse {
  projects?: IProject[]
}

export interface ICallHeaders {
  Accept?: string
}

export interface ICallResponse {
  blob: Function
}

export interface ICallError extends Error {
  info?: object
  status?: number
}
