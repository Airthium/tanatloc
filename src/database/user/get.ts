/** @module Database.User.Get */

import { IClientPlugin } from '@/plugins/index.d'
import { IModel } from '@/models/index.d'

import { tables } from '@/config/db'

import { getter } from '..'

export type TUserGet = (
  | 'id'
  | 'lastname'
  | 'firstname'
  | 'email'
  | 'avatar'
  | 'isvalidated'
  | 'lastmodificationdate'
  | 'superuser'
  | 'password'
  | 'passwordlastchange'
  | 'organizations'
  | 'projects'
  | 'workspaces'
  | 'authorizedplugins'
  | 'plugins'
  | 'models'
  | 'templates'
)[]
export type TUserGetKey = 'id' | 'email'

export type TUserGetId = 'id'[]
export type TUserGetLastname = 'lastname'[]
export type TUserGetFirstname = 'firstname'[]
export type TUserGetEmail = 'email'[]
export type TUserGetAvatar = 'avatar'[]
export type TUserGetIsvalidated = 'isvalidated'[]
export type TUserGetLastmodificationdate = 'lastmodificationdate'[]
export type TUserGetSuperuser = 'superuser'[]
export type TUserGetPassword = 'password'[]
export type TUserGetPasswordlastchange = 'passwordlastchange'[]
export type TUserGetOrganizations = 'organizations'[]
export type TUserGetProjects = 'projects'[]
export type TUserGetWorkspaces = 'workspaces'[]
export type TUserGetAuthorizedplugins = 'authorizedplugins'[]
export type TUserGetPlugins = 'plugins'[]
export type TUserGetModels = 'models'[]
export type TUserGetTemplates = 'templates'[]

export interface IUser<T = [], Key = 'id'> {
  id:
    | (TUserGetId extends T ? string : never)
    | (Key extends 'id' ? string : never)
  lastname?: TUserGetLastname extends T ? string : never
  firstname?: TUserGetFirstname extends T ? string : never
  email:
    | (TUserGetEmail extends T ? string : never)
    | (Key extends 'email' ? string : never)
  avatar?: TUserGetAvatar extends T ? string : never
  isvalidated: TUserGetIsvalidated extends T ? boolean : never
  lastmodificationdate: TUserGetLastmodificationdate extends T ? Date : never
  superuser: TUserGetSuperuser extends T ? boolean : never
  password: TUserGetPassword extends T ? string : never
  passwordlastchanged: TUserGetPasswordlastchange extends T ? Date : never
  organizations?: TUserGetOrganizations extends T ? string[] : never[]
  projects?: TUserGetWorkspaces extends T ? string[] : never[]
  workspaces?: TUserGetWorkspaces extends T ? string[] : never[]
  authorizedplugins?: TUserGetAuthorizedplugins extends T ? string[] : never[]
  plugins?: TUserGetPlugins extends T ? IClientPlugin[] : never[]
  models?: TUserGetModels extends T ? IModel[] : never[]
  templates?: TUserGetTemplates extends T ? string[] : never[]
}

/**
 * Get
 * @param id User id (or key)
 * @param data Data
 * @param key Key (override id selector)
 * @returns User
 */
export const get = async <T extends TUserGet, Key extends TUserGetKey>(
  id: string,
  data: T,
  key: TUserGetKey = 'id'
): Promise<IUser<T, Key>> => {
  const response = await getter(tables.USERS, id, data, key)

  const user = response.rows[0]
  user && (user[key] = id)

  return user
}
