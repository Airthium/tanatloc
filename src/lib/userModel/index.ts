/** @module Lib.UserModel */

import { IModel } from '@/models/index.d'
import { IDataBaseEntry } from '@/database/index.d'
import { IUserModelGet } from '../index.d'

import UserModelDB, { IUserModel, TUserModelGet } from '@/database/userModel'

import User from '../user'
import Group from '../group'

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
): Promise<IUserModelGet<T>> => {
  const userModelData = (await UserModelDB.get(id, data)) as IUserModelGet<T>

  if (data.includes('owners') && !userModelData.owners)
    userModelData.owners = []

  if (data.includes('groups') && !userModelData.groups)
    userModelData.groups = []

  if (data.includes('users') && !userModelData.users) userModelData.users = []

  return userModelData
}

/**
 * Add to group
 * @param group Group
 * @param userModel User model
 */
const addToGroup = async (
  group: string,
  userModel: { id: string }
): Promise<void> => {
  const groupData = await Group.get(group, ['usermodels'])
  if (!groupData.usermodels.includes(userModel.id))
    await Group.update({ id: group }, [
      {
        key: 'usermodels',
        type: 'array',
        method: 'append',
        value: userModel.id
      }
    ])
}

/**
 * Delete from group
 * @param group Group
 * @param userModel User model
 */
const deleteFromGroup = async (
  group: string,
  userModel: { id: string }
): Promise<void> => {
  await Group.update({ id: group }, [
    {
      key: 'usermodels',
      type: 'array',
      method: 'remove',
      value: userModel.id
    }
  ])
}

/**
 * Add to user
 * @param user User
 * @param userModel User model
 */
const addToUser = async (
  user: string,
  userModel: { id: string }
): Promise<void> => {
  const userData = await User.get(user, ['usermodels'])
  if (!userData.usermodels.includes(userModel.id))
    await User.update({ id: user }, [
      {
        key: 'usermodels',
        type: 'array',
        method: 'append',
        value: userModel.id
      }
    ])
}

/**
 * Delete from user
 * @param user User
 * @param userModel User model
 */
const deleteFromUser = async (
  user: string,
  userModel: { id: string }
): Promise<void> => {
  await User.update({ id: user }, [
    {
      key: 'usermodels',
      type: 'array',
      method: 'remove',
      value: userModel.id
    }
  ])
}

/**
 * Update
 * @param userModel User model
 * @param data Data
 */
const update = async (
  userModel: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Check groups
  const groupsUpdate: { value: string[] } = data.find(
    (d) => d.key === 'groups' && !d.type
  )
  if (groupsUpdate) {
    // Get data
    const userModelData = await get(userModel.id, ['groups'])

    // Deleted groups
    const deleted = userModelData.groups.filter(
      (g) => !groupsUpdate.value.includes(g)
    )

    await Promise.all(
      deleted.map(async (group) => deleteFromGroup(group, userModel))
    )

    // Added groups
    const added = groupsUpdate.value.filter(
      (g) => !userModelData.groups.find((gg) => gg === g)
    )

    await Promise.all(added.map(async (group) => addToGroup(group, userModel)))
  }

  // Check users
  const usersUpdate: { value: string[] } = data.find(
    (d) => d.key === 'users' && !d.type
  )
  if (usersUpdate) {
    // Get data
    const userModelData = await get(userModel.id, ['users'])

    // Deleted users
    const deleted = userModelData.users.filter(
      (u) => !usersUpdate.value.includes(u)
    )

    await Promise.all(
      deleted.map(async (user) => deleteFromUser(user, userModel))
    )

    // Added users
    const added = usersUpdate.value.filter(
      (u) => !userModelData.users.includes(u)
    )

    await Promise.all(added.map(async (user) => addToUser(user, userModel)))
  }

  // Update
  await UserModelDB.update(userModel, data)
}

/**
 * Delete
 * @param userModel User model
 */
const del = async (userModel: { id: string }): Promise<void> => {
  // Get data
  const data = await get(userModel.id, ['groups', 'users'])

  // Delete from groups
  await Promise.all(
    data.groups.map(async (group) => deleteFromGroup(group, userModel))
  )

  // Delete from users
  await Promise.all(
    data.users.map(async (user) => deleteFromUser(user, userModel))
  )

  await UserModelDB.del(userModel)
}

const UserModel = { add, get, update, del }
export default UserModel
