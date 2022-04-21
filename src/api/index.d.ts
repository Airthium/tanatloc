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

/**
 * Geometries
 */
export interface IFrontGeometriesItem
  extends IGeometry<
    ('name' | 'originalfilename' | 'summary' | 'dimension' | 'project')[]
  > {}

export interface IFrontGeometries extends Array<IFrontGeometriesItem> {}

/**
 * Groups
 */
export interface IFrontGroupsItem
  extends IGroupWithData<('name' | 'users')[]> {}

export interface IFrontGroups extends Array<IFrontGroupsItem> {}

/**
 * Organizations
 */
export interface IFrontOrganizationsItem
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

export interface IFrontOrganizations extends Array<IFrontOrganizationsItem> {}

/**
 * Project
 */
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

/**
 * Projects
 */
export interface IFrontProjectsItem
  extends IProjectWithData<
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
  > {}

export interface IFrontProjects extends Array<IFrontProjectsItem> {}

/**
 * Simulation
 */
export interface IFrontSimulation
  extends ISimulation<('name' | 'scheme' | 'tasks')[]> {}

/**
 * Simulations
 */
export interface IFrontSimulationsItem
  extends ISimulation<('name' | 'scheme' | 'project')[]> {}
export interface IFrontSimulations extends Array<IFrontSimuationsItem> {}

/**
 * System
 */
export interface IFrontSystem
  extends ISystem<('allowsignup' | 'password' | 'defaultplugins')[]> {}

/**
 * User
 */
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

/**
 * Users
 */
export interface IFrontUsersItem
  extends IUserWithData<
    (
      | 'id'
      | 'firstname'
      | 'lastname'
      | 'email'
      | 'authorizedplugins'
      | 'superuser'
    )[]
  > {}

export interface IFrontUsers extends Array<IFrontUsersItem> {}

/**
 * Workspaces
 */
export interface IFrontWorkspacesItem
  extends IWorkspaceWithData<
    ('name' | 'owners' | 'users' | 'groups' | 'projects')[]
  > {}
export interface IFrontWorkspaces extends Array<IFrontWorkspacesItem> {}

/**
 * Fetch
 */
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
