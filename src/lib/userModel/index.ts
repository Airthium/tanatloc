/** @module Lib.UserModel */

import { IModel } from '@/models/index.d'
import { IDataBaseEntry } from '@/database/index.d'

import UserModelDB, { IUserModel, TUserModelGet } from '@/database/userModel'

import User from '../user'

/**
 * Add
 * @param userModel User model
 * @param user User
 * @returns New user model
 */
const add = async (
  userModel: { model: IModel; template: string },
  user: { id: string }
): Promise<IUserModel> => {
  // Add user model
  const newUserModel = await UserModelDB.add(userModel, user)

  // Update user
  await User.update(user, [
    {
      key: 'usermodels',
      type: 'array',
      method: 'append',
      value: newUserModel.id
    }
  ])

  // Return
  return newUserModel
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns UserModel
 */
const get = async <T extends TUserModelGet>(
  id: string,
  data: T
): Promise<IUserModel<T>> => UserModelDB.get(id, data)

/**
 * Update
 * @param userModel User model
 * @param data Data
 */
const update = async (
  userModel: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // TODO users & groups

  await UserModelDB.update(userModel, data)
}

/**
 * Delete
 * @param userModel User model
 */
const del = async (userModel: { id: string }): Promise<void> => {
  // Delete from groups
  // TODO

  // Delete from users
  // TODO

  await UserModelDB.del(userModel)
}

const UserModel = { add, get, update, del }
export default UserModel
