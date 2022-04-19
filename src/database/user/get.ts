/** @module Database.User.Get */

import { IPlugin } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

export type TUserGet = (
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
  | 'authorizedplugins'
  | 'plugins'
)[]
export type TUserGetKey = 'id' | 'email'

export interface IUser<T, Key = 'id'> {
  id: (T extends ['id'] ? string : never) | (Key extends 'id' ? string : never)
  lastname?: T extends ['lastname'] ? string : never
  firstname?: T extends ['firstname'] ? string : never
  email:
    | (T extends ['email'] ? string : never)
    | (Key extends 'email' ? string : never)
  avatar?: T extends ['firstname'] ? string : never
  isvalidated: T extends ['isvalidated'] ? boolean : never
  lastmodificationdate: T extends ['lastmodificationdate'] ? Date : never
  superuser: T extends ['superuser'] ? boolean : never
  passwordlastchanged: T extends ['passwordlastchanged'] ? Date : never
  organizations?: T extends ['organizations'] ? string[] : never[]
  workspaces?: T extends ['workspaces'] ? string[] : never[]
  authorizedplugins?: T extends ['authorizedplugins'] ? string[] : never[]
  plugins?: T extends ['plugins'] ? IPlugin[] : never[]
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
