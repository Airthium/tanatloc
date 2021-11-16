import { ISystem } from '@/database'
import { IProjectWithData, IUserWithData, IWorkspaceWithData } from '@/lib'

export interface IFetchResponse {
  project?: IProjectWithData[]
  projects?: IProjectWithDate[]
  system?: ISystem
  user?: IUserWithData
  users?: IUserWithData[]
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
