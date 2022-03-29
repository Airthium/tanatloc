/** @module Lib.Interface */

import {
  IGroup,
  IUser,
  IWorkspace,
  IProject,
  INewGeometry,
  IOrganization
} from '@/database/index.d'

export interface INewGeometryWithData extends INewGeometry {
  json: string
  glb: string
  summary: {
    type: string
    uuid: string
    solids?: Array<{
      uuid: string
      color: { r: number; g: number; b: number }
    }>
    faces?: Array<{
      uuid: string
      color: { r: number; g: number; b: number }
    }>
    edges?: Array<{
      uuid: string
      color: { r: number; g: number; b: number }
    }>
  }
  dimension: number
}

export interface IGeometryFile {
  extension: string
  buffer: Buffer
}

export interface IGeometryPart {
  uuid: string
  buffer: Buffer
}

export interface IGroupWithData extends Omit<IGroup, 'users'> {
  users?: IUserWithData[]
}

export interface IOrganizationWithData
  extends Omit<
    IOrganization,
    'owners' | 'pendingowners' | 'users' | 'pendingusers' | 'groups'
  > {
  owners?: IUserWithData[]
  pendingowners?: IUserWithData[]
  users?: IUserWithData[]
  pendingusers?: IUserWithData[]
  groups?: IGroupWithData[]
}

export interface IProjectWithData
  extends Omit<IProject, 'avatar' | 'owners' | 'users' | 'groups'> {
  avatar?: Buffer
  owners?: IUserWithData[]
  users?: IUserWithData[]
  groups?: IGroupWithData[]
}

export interface IUserWithData extends Omit<IUser, 'avatar'> {
  avatar?: Buffer
  pending?: boolean
}

export interface IWorkspaceWithData
  extends Omit<IWorkspace, 'owners' | 'users' | 'groups' | 'projects'> {
  owners?: IUserWithData[]
  users?: IUserWithData[]
  groups?: IGroupWithData[]
  projects?: string[]
}
