import { ISimulation } from '@/database/index.d'
import { IGeometry, IPlugin, ISystem } from '@/database/index.d'
import {
  IGroupWithData,
  IOrganizationWithData,
  IProjectWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

export interface IFetchResponse {
  geometries?: IGeometry[]
  groups?: IGroupWithData[]
  plugins?: IPlugin[]
  organizations?: IOrganizationWithData[]
  project?: IProjectWithData
  projects?: IProjectWithData[]
  simulation?: ISimulation
  simulations?: ISimulation[]
  system?: ISystem
  user?: IUserWithData
  users?: IUserWithData[]
  workspaces?: IWorkspaceWithData[]
}

export interface ICallHeaders {
  Accept?: string
}

export interface ICallResponse {
  status?: number
  blob?: Function
  json?: Function
}

export interface ICallError extends Error {
  info?: {
    message: string
  }
  status?: number
}
