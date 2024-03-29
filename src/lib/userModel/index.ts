/** @module Lib.UserModel */

import { IModel } from '@/models/index.d'
import { IDataBaseEntry } from '@/database/index.d'
import {
  IGroupGet,
  IUserModelGet,
  IUserModelWithData,
  IUserWithData
} from '../index.d'

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

  // Update model
  newUserModel.model.userModelId = newUserModel.id
  await UserModelDB.update({ id: newUserModel.id }, [
    {
      key: 'model',
      value: newUserModel.model
    }
  ])

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
): Promise<IUserModelGet<T> | undefined> => {
  const userModelData = await UserModelDB.get(id, data)
  if (!userModelData) return

  if (data.includes('owners') && !userModelData.owners)
    userModelData.owners = []

  if (data.includes('users') && !userModelData.users) userModelData.users = []

  if (data.includes('groups') && !userModelData.groups)
    userModelData.groups = []

  return userModelData
}

/**
 * Get users data
 * @param users Users
 * @returns Users data
 */
const getUsersData = async (
  users: string[]
): Promise<
  IUserWithData<('email' | 'lastname' | 'firstname' | 'avatar')[]>[]
> => {
  if (!users) return []

  const usersData = []
  for (const user of users) {
    const userData = await User.getWithData(user, [
      'lastname',
      'firstname',
      'email',
      'avatar'
    ])
    if (!userData) continue

    usersData.push(userData)
  }

  return usersData
}

/**
 * Get groups data
 * @param groups Groups
 * @returns Groups data
 */
const getGroupsData = async (
  groups: string[]
): Promise<IGroupGet<'name'[]>[]> => {
  if (!groups) return []

  const groupsData = []
  for (const group of groups) {
    const groupData = await Group.get(group, ['name'])
    if (!groupData) continue

    groupsData.push(groupData)
  }

  return groupsData
}

/**
 * Get with data
 * @param id Id
 * @param data Data
 * @returns UserModel
 */
const getWithData = async <T extends TUserModelGet>(
  id: string,
  data: T
): Promise<IUserModelWithData<T> | undefined> => {
  const userModel = await get(id, data)
  if (!userModel) return

  const { owners, users, groups, ...userModelData } = userModel

  // Get owners
  const ownersData = await getUsersData(owners)

  // Get users
  const usersData = await getUsersData(users)

  // Get groups
  const groupsData = await getGroupsData(groups)

  return {
    ...userModelData,
    owners: ownersData,
    users: usersData,
    groups: groupsData
  } as IUserModelWithData<T>
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
  if (!groupData) return

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
  if (!userData) return

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
 * Group update
 * @param userModel User model
 * @param toUpdate Groups to update
 */
const groupUpdate = async (
  userModel: { id: string },
  toUpdate: { value: string[] }
): Promise<void> => {
  // Get data
  const userModelData = await getWithData(userModel.id, ['groups'])

  if (!userModelData) return

  // Deleted groups
  const deleted = userModelData.groups.filter(
    (group) => !toUpdate.value.includes(group.id)
  )

  for (const group of deleted) await deleteFromGroup(group.id, userModel)

  // Added groups
  const added = toUpdate.value.filter(
    (group) => !userModelData.groups.find((g) => g.id === group)
  )

  for (const group of added) await addToGroup(group, userModel)
}

/**
 * User update
 * @param userModel User model
 * @param toUpdate Users to update
 */
const userUpdate = async (
  userModel: { id: string },
  toUpdate: { value: string[] }
): Promise<void> => {
  // Get data
  const userModelData = await getWithData(userModel.id, ['users'])

  if (!userModelData) return

  // Deleted users
  const deleted = userModelData.users.filter(
    (user) => !toUpdate.value.includes(user.id)
  )

  for (const user of deleted) await deleteFromUser(user.id, userModel)

  // Added users
  const added = toUpdate.value.filter(
    (user) => !userModelData.users.find((u) => u.id === user)
  )

  for (const user of added) await addToUser(user, userModel)
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
  if (groupsUpdate) await groupUpdate(userModel, groupsUpdate)

  // Check users
  const usersUpdate: { value: string[] } = data.find(
    (d) => d.key === 'users' && !d.type
  )
  if (usersUpdate) await userUpdate(userModel, usersUpdate)

  // Update
  await UserModelDB.update(userModel, data)
}

/**
 * Delete
 * @param user User
 * @param userModel User model
 */
const del = async (
  user: { id: string },
  userModel: { id: string }
): Promise<void> => {
  // Get data
  const data = await getWithData(userModel.id, ['groups', 'users', 'owners'])

  if (data) {
    // Delete from groups
    for (const group of data.groups) await deleteFromGroup(group.id, userModel)

    // Delete from owners
    for (const owner of data.owners) await deleteFromUser(owner.id, userModel)

    // Delete from users
    for (const user of data.users) await deleteFromUser(user.id, userModel)
  }

  // Delete user model
  await UserModelDB.del(userModel)

  // Delete userModel reference in user
  await User.update(user, [
    {
      type: 'array',
      method: 'remove',
      key: 'usermodels',
      value: userModel.id
    }
  ])
}

const UserModel = { add, getWithData, update, del }
export default UserModel
