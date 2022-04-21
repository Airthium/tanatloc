/** @module API.Interface */

import { IGeometry } from '@/database/geometry'
import { INewGroup } from '@/database/group'
import { INewOrganization } from '@/database/organization'
import { INewProject } from '@/database/project'
import { INewSimulation, ISimulation } from '@/database/simulation'
import { ISystem } from '@/database/system'
import { INewUser } from '@/database/user'
import { INewWorkspace } from '@/database/workspace'
import { IClientPlugin } from '@/plugins/index.d'
import {
  IGroupWithData,
  INewGeometryWithData,
  IOrganizationWithData,
  IProjectWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

/**
 * Geometries
 */
export interface IFrontNewGeometry extends INewGeometryWithData {}

export interface IFrontGeometriesItem
  extends IGeometry<
    ('name' | 'originalfilename' | 'summary' | 'dimension' | 'project')[]
  > {}

export interface IFrontGeometries extends Array<IFrontGeometriesItem> {}

/**
 * Groups
 */
export interface IFrontNewGroup extends INewGroup {}

export interface IFrontGroupsItem
  extends IGroupWithData<('name' | 'users')[]> {}

export interface IFrontGroups extends Array<IFrontGroupsItem> {}

/**
 * Organizations
 */
export interface IFrontNewOrganization extends INewOrganization {}

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
export interface IFrontNewProject extends INewProject {}

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
export interface IFrontNewSimulation extends INewSimulation {}

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
export interface IFrontNewUser extends INewUser {}

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
export interface IFrontNewWorkspace extends INewWorkspace {}

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
  organizations?: IFrontOrganizations
  plugins?: IClientPlugin[]
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
