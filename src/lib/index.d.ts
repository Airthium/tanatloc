/** @module Lib.Interface */

import { IGeometry, INewGeometry } from '@/database/geometry'
import {
  IGroup,
  IUser,
  IWorkspace,
  IProject,
  IOrganization
} from '@/database/index.d'

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
  json: IGeometry['json']
  glb: IGeometry['glb']
  summary: IGeometry['summary']
  dimension: IGeometry['dimension']
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
export interface IGroupWithData extends Omit<IGroup<T>, 'users'> {
  users: T extends ['users'] ? IUserWithData[] : never[]
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
