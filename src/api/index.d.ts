/** @module API.Interface */

import { ISimulation } from '@/database/index.d'
import { IGeometry, IClientPlugin, ISystem } from '@/database/index.d'
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
  plugins?: IClientPlugin[]
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
  blob: () => Promise<Blob>
  json: () => Promise<any>
}

export interface ICallError extends Error {
  info?: {
    message: string
  }
  status?: number
}
