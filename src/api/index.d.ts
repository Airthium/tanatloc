import { IProjectWithData, IWorkspaceWithData } from '@/lib'

export interface IFetchResponse {
  project?: IProjectWithData[]
  projects?: IProjectWithDate[]
  workspaces?: IWorkspaceWithData[]
}

export interface ICallHeaders {
  Accept?: string
}

export interface ICallResponse {
  blob?: Function
  json?: Function
}

export interface ICallError extends Error {
  info?: object
  status?: number
}
