/** @module API.Interface */

import { INewAvatar } from '@/database/avatar'
import { IGeometry } from '@/database/geometry'
import { INewGroup } from '@/database/group'
import { INewOrganization } from '@/database/organization'
import { INewProject } from '@/database/project'
import {
  INewSimulation,
  ISimulation,
  ISimulationTask,
  ISimulationTaskFile
} from '@/database/simulation'
import { ISystem } from '@/database/system'
import { INewUser } from '@/database/user'
import { INewWorkspace } from '@/database/workspace'
import { IClientPlugin } from '@/plugins/index.d'
import {
  IGroupWithData,
  INewGeometryWithData,
  IOrganizationWithData,
  IProjectWithData,
  ISimulationGet,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

/**
 * Avatar
 */
export interface IFrontNewAvatar extends INewAvatar {}

/**
 * Geometries
 */
export interface IFrontNewGeometry extends INewGeometryWithData {}

export interface IFrontGeometriesItem
  extends IGeometry<
    ('name' | 'originalfilename' | 'summary' | 'dimension' | 'project')[]
  > {
  needCleanup?: boolean
}

export interface IFrontMutateGeometriesItem
  extends Partial<IFrontGeometriesItem> {
  id: string
}

export interface IFrontGeometries extends Array<IFrontGeometriesItem> {}

/**
 * Groups
 */
export interface IFrontNewGroup extends INewGroup {}

export interface IFrontGroupsItem
  extends IGroupWithData<('name' | 'users')[]> {}

export interface IFrontMutateGroupsItem extends Partial<IFrontGroupsItem> {
  id: string
}

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

export interface IFrontMutateOrganizationsItem
  extends Partial<IFrontOrganizationsItem> {
  id: string
}

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

export interface IFrontMutateProject extends Partial<IFrontProject> {}

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

export interface IFrontMutateProjectsItem extends Partial<IFrontProjectsItem> {
  id: string
}

export interface IFrontProjects extends Array<IFrontProjectsItem> {}

/**
 * Result
 */
export interface IFrontResult extends ISimulationTaskFile {}

/**
 * Simulation
 */
export interface IFrontSimulation
  extends ISimulationGet<('name' | 'scheme' | 'tasks')[]> {}

export interface IFrontMutateSimulation extends Partial<IFrontSimulation> {}

export interface IFrontSimulationTask extends ISimulationTask {}

/**
 * Simulations
 */
export interface IFrontNewSimulation extends INewSimulation {}

export interface IFrontSimulationsItem
  extends ISimulationGet<('name' | 'scheme' | 'project')[]> {}

export interface IFrontMutateSimulationsItem
  extends Partial<IFrontSimulationsItem> {
  id: string
}

export interface IFrontSimulations extends Array<IFrontSimuationsItem> {}

/**
 * System
 */
export interface IFrontSystem
  extends ISystem<('allowsignup' | 'password' | 'defaultplugins')[]> {}

export interface IFrontMutateSystem extends Partial<IFrontSystem> {}

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
      | 'models'
    )[]
  > {}

export interface IFrontMutateUser extends Partial<IFrontUser> {}

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

export interface IFrontMutateUsersItem extends Partial<IFrontUsersItem> {
  id: string
}

export interface IFrontUsers extends Array<IFrontUsersItem> {}

/**
 * Workspaces
 */
export interface IFrontNewWorkspace extends INewWorkspace {}

export interface IFrontWorkspacesItem
  extends IWorkspaceWithData<
    ('name' | 'owners' | 'users' | 'groups' | 'projects')[]
  > {}

export interface IFrontMutateWorkspacesItem
  extends Partial<IFrontWorkspacesItem> {
  id: string
}

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
