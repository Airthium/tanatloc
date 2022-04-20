/** @module Database.Project.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TProjectGet = (
  | 'archived'
  | 'title'
  | 'description'
  | 'avatar'
  | 'public'
  | 'history'
  | 'createddate'
  | 'lastaccess'
  | 'geometries'
  | 'simulations'
  | 'owners'
  | 'users'
  | 'groups'
  | 'workspace'
)[]

export type TProjectGetArchived = 'archived'[]
export type TProjectGetTitle = 'title'[]
export type TProjectGetDescription = 'description'[]
export type TProjectGetAvatar = 'avatar'[]
export type TProjectGetPublic = 'public'[]
export type TProjectGetHistory = 'history'[]
export type TProjectGetCreateddate = 'createddate'[]
export type TProjectGetLastaccess = 'lastaccess'[]
export type TProjectGetGeometries = 'geometries'[]
export type TProjectGetSimulations = 'simulations'[]
export type TProjectGetOwners = 'owners'[]
export type TProjectGetUsers = 'users'[]
export type TProjectGetGroups = 'groups'[]
export type TProjectGetWorkspace = 'workspace'[]

export interface IProject<T = []> {
  id: string
  archived?: TProjectGetArchived extends T ? boolean : never
  title: TProjectGetTitle extends T ? string : never
  description?: TProjectGetDescription extends T ? string : never
  avatar?: TProjectGetAvatar extends T ? string : never
  public?: TProjectGetPublic extends T ? boolean : never
  history?: TProjectGetHistory extends T ? object : never
  createddate: TProjectGetCreateddate extends T ? Date : never
  lastaccess: TProjectGetLastaccess extends T ? Date : never
  geometries?: TProjectGetGeometries extends T ? string[] : never[]
  simulations?: TProjectGetSimulations extends T ? string[] : never[]
  owners: TProjectGetOwners extends T ? string[] : never[]
  users?: TProjectGetUsers extends T ? string[] : never[]
  groups?: TProjectGetGroups extends T ? string[] : never[]
  workspace: TProjectGetWorkspace extends T ? string : never
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Project
 */
export const get = async <T extends TProjectGet>(
  id: string,
  data: T
): Promise<IProject<T>> => {
  const response = await getter(tables.PROJECTS, id, data)

  const project = response.rows[0]
  project && (project.id = id)

  return project
}
