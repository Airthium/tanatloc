/** @module Lib.Interface */

import { IGeometry, INewGeometry } from '@/database/geometry'
import { IGroup } from '@/database/group'
import { IUser } from '@/database/user'
import { IWorkspace } from '@/database/workspace'
import { IProject } from '@/database/project'
import { IOrganization } from '@/database/organization'
import { ISimulation } from '@/database/simulation'
import { IPlugin } from '@/plugins'

/**
 * Geometry
 */
export interface IGeometrySummaryFile {
  type: string
  uuid: string
  solids?: {
    name: string
    path: string
    number: string
  }[]
  faces?: {
    name: string
    path: string
    number: string
  }[]
  edges?: {
    name: string
    path: string
    number: string
  }[]
}

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
  json: IGeometry<'json'[]>['json']
  glb: IGeometry<'glb'[]>['glb']
  summary: IGeometry<'summary'[]>['summary']
  dimension: IGeometry<'dimension'[]>['dimension']
}

export interface IGeometryFile {
  extension: string
  buffer: Buffer
}

export interface IGeometryPart {
  uuid: string
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

export interface IGroupWithData<T = []> extends Omit<IGroup<T>, 'users'> {
  users: T extends ['users'] ? IUserWithData[] : never[]
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
    IOrganization<T>,
    'owners' | 'pendingowners' | 'users' | 'pendingusers' | 'groups'
  > {
  owners: 'owners'[] extends T ? IUserWithData[] : never[]
  pendingowners: 'pendingowners'[] extends T ? IUserWithData[] : never[]
  users: 'users'[] extends T ? IUserWithData[] : never[]
  pendingusers: 'pendingusers'[] extends T ? IUserWithData[] : never[]
  groups: 'groups' extends T ? IGroupWithData[] : never[]
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
  extends Omit<IProject<T>, 'avatar' | 'owners' | 'users' | 'groups'> {
  avatar?: 'avatar'[] extends T ? Buffer : never
  owners: 'owners'[] extends T ? IUserWithData[] : never[]
  users: 'users'[] extends T ? IUserWithData[] : never[]
  groups: 'groups'[] extends T ? IGroupWithData[] : never[]
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
    IUser,
    'organizations' | 'workspaces' | 'authorizedplugins' | 'plugins'
  > {
  organizations: 'organizations'[] extends T ? string[] : never[]
  workspaces: 'workspaces'[] extends T ? string[] : never[]
  authorizedplugins: 'authorizedplugins'[] extends T ? string[] : never[]
  plugins: 'plugins'[] extends T ? IPlugin[] : never[]
}

export interface IUserWithData<T = []> extends Omit<IUser<T>, 'avatar'> {
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
  extends Omit<IWorkspace<T>, 'owners' | 'users' | 'groups' | 'projects'> {
  owners: 'owners'[] extends T ? IUserWithData[] : never[]
  users: 'users'[] extends T ? IUserWithData[] : never[]
  groups: 'groups'[] extends T ? IGroupWithData[] : never[]
  projects: 'projects'[] extends T ? string[] : never[]
}
