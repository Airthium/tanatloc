/** @module Database.UserModel.Get */

import { IModel } from '@/models/index.d'
import { getter } from '..'
import { tables } from '@/config/db'

export type TUserModelGet = (
  | 'model'
  | 'template'
  | 'owners'
  | 'users'
  | 'groups'
)[]

export type TUserModelGetModel = 'model'[]
export type TUserModelGetTemplate = 'template'[]
export type TUserModelGetOwners = 'owners'[]
export type TUserModelGetUsers = 'users'[]
export type TUserModelGetGroups = 'groups'[]

export interface IUserModel<T = []> {
  id: string
  model: TUserModelGetModel extends T ? IModel : never
  template: TUserModelGetTemplate extends T ? string : never
  owners: TUserModelGetOwners extends T ? string[] : never
  users: TUserModelGetUsers extends T ? string[] : never
  groups: TUserModelGetGroups extends T ? string[] : never
}

/**
 * Get
 * @param id User model id
 * @param data Data
 * @returns UserModel
 */
export const get = async <T extends TUserModelGet>(
  id: string,
  data: T
): Promise<IUserModel<T>> => {
  const response = await getter(tables.MODELS, id, data)

  const userModel = response.rows[0]
  userModel && (userModel.id = id)

  return userModel
}
