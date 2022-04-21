/** @module API.Interface */

import { ISimulation } from '@/database/simulation'
import { IGeometry } from '@/database/geometry'
import { ISystem } from '@/database/system'
import { IClientPlugin } from '@/plugins/index.d'
import {
  IGroupWithData,
  IOrganizationWithData,
  IProjectWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

export interface IFrontGeometries
  extends Array<
    IGeometry<
      ('name' | 'originalfilename' | 'summary' | 'dimension' | 'project')[]
    >
  > {}

export interface IFrontGroups
  extends Array<IGroupWithData<('name' | 'users')[]>> {}

export interface IFrontOrganizations
  extends IOrganizationWithData<
    (
      | 'name'
      | 'owners'
      | 'pendingowners'
      | 'users'
      | 'pendingusers'
      | 'groups'
    )[]
  > {}

export interface IFrontProject
  extends IProjectWithData<
    (
      | 'title'
      | 'description'
      | 'avatar'
      | 'owners'
      | 'users'
      | 'geometries'
      | 'simulations'
    )[]
  > {}

export interface IFrontProjects
  extends Array<
    IProjectWithData<
      (
        | 'archived'
        | 'title'
        | 'description'
        | 'createddate'
        | 'lastaccess'
        | 'avatar'
        | 'owners'
        | 'users'
        | 'groups'
        | 'simulations'
        | 'workspace'
      )[]
    >
  > {}

export interface IFrontSimulation
  extends ISimulation<('name' | 'scheme' | 'tasks')[]> {}

export interface IFrontSimulations
  extends Array<ISimulation<('name' | 'scheme' | 'project')[]>> {}

export interface IFrontSystem
  extends ISystem<('allowsignup' | 'password' | 'defaultplugins')[]> {}

export interface IFrontUser
  extends IUserWithData<
    (
      | 'lastname'
      | 'firstname'
      | 'email'
      | 'avatar'
      | 'superuser'
      | 'authorizedplugins'
      | 'plugins'
    )[]
  > {}

export interface IFrontUsers
  extends Array<
    IUserWithData<
      (
        | 'id'
        | 'firstname'
        | 'lastname'
        | 'email'
        | 'authorizedplugins'
        | 'superuser'
      )[]
    >
  > {}

export interface IFrontWorkspaces
  extends Array<
    IWorkspaceWithData<('name' | 'owners' | 'users' | 'groups' | 'projects')[]>
  > {}

export interface IFetchResponse {
  geometries?: IFrontGeometries
  groups?: IFrontGroups
  plugins?: IClientPlugin[]
  organizations?: IFrontOrganizations
  project?: IFrontProject
  projects?: IFrontProjects
  simulation?: IFrontSimulation
  simulations?: IFrontSimulations
  system?: IFrontSystem
  user?: IFrontUser
  users?: IFrontUsers
  workspaces?: IFrontWorkspaces
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
