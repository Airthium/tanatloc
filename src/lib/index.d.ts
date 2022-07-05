/** @module Lib.Interface */

import { IGeometry, INewGeometry } from '@/database/geometry'
import { TGeometrySummary } from '@/database/geometry/get'
import { IGroup } from '@/database/group'
import { IUser } from '@/database/user'
import { IWorkspace } from '@/database/workspace'
import { IProject } from '@/database/project'
import { IOrganization } from '@/database/organization'
import { ISimulation } from '@/database/simulation'
import { IClientPlugin } from '@/plugins'

/**
 * Geometry
 */
export interface IGeometryEntityAttribute {
  itemSize: number
  array: number[]
}

export interface IGeometryEntityFile {
  uuid: string
  label: string
  data: {
    attributes: {
      position: IGeometryEntityAttribute
      color?: IGeometryEntityAttribute
    }
  }
}

export interface INewGeometryWithData extends INewGeometry {
  summary: IGeometry<'summary'[]>['summary']
  glb: IGeometry<'glb'[]>['glb']
  brep: IGeometry<'brep'[]>['brep']
}

export interface IGeometryFile {
  extension: string
  buffer: Buffer
}

export interface IGeometryPart {
  summary: TGeometrySummary
  buffer: Buffer
}

/**
 * Group
 */
export interface IGroupGet<T = []>
  extends Omit<IGroup<T>, 'users' | 'workspaces' | 'projects'> {
  users: 'users'[] extends T ? string[] : never[]
  workspaces: 'workspaces'[] extends T ? string[] : never[]
  projects: 'projects'[] extends T ? string[] : never[]
}

export interface IGroupWithData<T = []> extends Omit<IGroupGet<T>, 'users'> {
  users: 'users'[] extends T
    ? Pick<
        IUserWithData<('firstname' | 'lastname' | 'email' | 'avatar')[]>,
        'id' | 'firstname' | 'lastname' | 'email' | 'avatar'
      >[]
    : never[]
}

/**
 * Organization
 */
export interface IOrganizationGet<T = []>
  extends Omit<
    IOrganization<T>,
    'pendingowners' | 'users' | 'pendingusers' | 'groups'
  > {
  pendingowners: 'pendingowners'[] extends T ? string[] : never[]
  users: 'users'[] extends T ? string[] : never[]
  pendingusers: 'pendingusers'[] extends T ? string[] : never[]
  groups: 'groups'[] extends T ? string[] : never[]
}

export interface IOrganizationWithData<T = []>
  extends Omit<
    IOrganizationGet<T>,
    'owners' | 'pendingowners' | 'users' | 'pendingusers' | 'groups'
  > {
  owners: 'owners'[] extends T
    ? Pick<
        IUserWithData<('email' | 'firstname' | 'lastname' | 'avatar')[]>,
        'id' | 'email' | 'firstname' | 'lastname' | 'avatar'
      >[]
    : never[]
  pendingowners: 'pendingowners'[] extends T
    ? Pick<IUserWithData<'email'[]>, 'id' | 'email'>[]
    : never[]
  users: 'users'[] extends T
    ? Pick<
        IUserWithData<('email' | 'firstname' | 'lastname' | 'avatar')[]>,
        'id' | 'email' | 'firstname' | 'lastname' | 'avatar'
      >[]
    : never[]
  pendingusers: 'pendingusers'[] extends T
    ? Pick<IUserWithData<'email'[]>, 'id' | 'email'>[]
    : never[]
  groups: 'groups'[] extends T
    ? Pick<IGroupWithData<('name' | 'users')[]>, 'id' | 'name' | 'users'>[]
    : never[]
}

/**
 * Project
 */
export interface IProjectGet<T = []>
  extends Omit<
    IProject<T>,
    'geometries' | 'simulations' | 'owners' | 'users' | 'groups'
  > {
  geometries: 'geometries'[] extends T ? string[] : never[]
  simulations: 'simulations'[] extends T ? string[] : never[]
  owners: 'owners'[] extends T ? string[] : never[]
  users: 'users'[] extends T ? string[] : never[]
  groups: 'groups'[] extends T ? string[] : never[]
}

export interface IProjectWithData<T = []>
  extends Omit<IProjectGet<T>, 'avatar' | 'owners' | 'users' | 'groups'> {
  avatar?: 'avatar'[] extends T ? Buffer : never
  owners: 'owners'[] extends T
    ? Pick<
        IUserWithData<('email' | 'lastname' | 'firstname' | 'avatar')[]>,
        'id' | 'email' | 'lastname' | 'firstname' | 'avatar'
      >[]
    : never[]
  users: 'users'[] extends T
    ? Pick<
        IUserWithData<('email' | 'lastname' | 'firstname' | 'avatar')[]>,
        'id' | 'email' | 'lastname' | 'firstname' | 'avatar'
      >[]
    : never[]
  groups: 'groups'[] extends T
    ? Pick<IGroupWithData<'name'[]>, 'id' | 'name'>[]
    : never[]
}

/**
 * Simulation
 */
export interface ISimulationGet<T = []> extends Omit<ISimulation<T>, 'tasks'> {
  tasks: 'tasks'[] extends T ? ISimulationTask[] : never[]
}

/**
 * User
 */
export interface IUserGet<T = []>
  extends Omit<
    IUser<T>,
    'organizations' | 'workspaces' | 'authorizedplugins' | 'plugins'
  > {
  organizations: 'organizations'[] extends T ? string[] : never[]
  workspaces: 'workspaces'[] extends T ? string[] : never[]
  authorizedplugins: 'authorizedplugins'[] extends T ? string[] : never[]
  plugins: 'plugins'[] extends T ? IClientPlugin[] : never[]
}

export interface IUserWithData<T = []> extends Omit<IUserGet<T>, 'avatar'> {
  avatar?: 'avatar'[] extends T ? Buffer : never
}

/**
 * Workspace
 */
export interface IWorkspaceGet<T = []>
  extends Omit<
    IWorkspace<T>,
    'owners' | 'users' | 'groups' | 'projects' | 'archivedprojects'
  > {
  owners: 'owners'[] extends T ? string[] : never[]
  users: 'users'[] extends T ? string[] : never[]
  groups: 'groups'[] extends T ? string[] : never[]
  projects: 'projects'[] extends T ? string[] : never[]
  archivedprojects: 'archivedprojects'[] extends T ? object[] : never[]
}

export interface IWorkspaceWithData<T = []>
  extends Omit<IWorkspaceGet<T>, 'owners' | 'users' | 'groups' | 'projects'> {
  owners: 'owners'[] extends T
    ? Pick<
        IUserWithData<('email' | 'lastname' | 'firstname' | 'avatar')[]>,
        'id' | 'email' | 'lastname' | 'firstname' | 'avatar'
      >[]
    : never[]
  users: 'users'[] extends T
    ? Pick<
        IUserWithData<('email' | 'lastname' | 'firstname' | 'avatar')[]>,
        'id' | 'email' | 'lastname' | 'firstname' | 'avatar'
      >[]
    : never[]
  groups: 'groups'[] extends T
    ? Pick<IGroupWithData<'name'[]>, 'id' | 'name'>[]
    : never[]
  projects: 'projects'[] extends T ? string[] : never[]
}
