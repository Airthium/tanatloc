/** @module Lib.UserModel */

import { IModel } from '@/models/index.d'
import { IDataBaseEntry } from '@/database/index.d'
import { IUserModelGet, IUserModelWithData } from '../index.d'

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
  const ownersData = []
  if (owners) {
    for (const owner of owners) {
      const ownerData = await User.getWithData(owner, [
        'lastname',
        'firstname',
        'email',
        'avatar'
      ])
      if (!ownerData) continue

      ownersData.push(ownerData)
    }
  }

  // Get users
  const usersData = []
  if (users) {
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
  }

  // Get groups
  const groupsData = []
  if (groups) {
    for (const group of groups) {
      const groupData = await Group.get(group, ['name'])
      if (!groupData) continue

      groupsData.push(groupData)
    }
  }

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
    const userModelData = await getWithData(userModel.id, ['groups'])

    if (userModelData) {
      // Deleted groups
      const deleted = userModelData.groups.filter(
        (g) => !groupsUpdate.value.includes(g.id)
      )

      for (const group of deleted) await deleteFromGroup(group.id, userModel)

      // Added groups
      const added = groupsUpdate.value.filter(
        (g) => !userModelData.groups.find((gg) => gg.id === g)
      )

      for (const group of added) await addToGroup(group, userModel)
    }
  }

  // Check users
  const usersUpdate: { value: string[] } = data.find(
    (d) => d.key === 'users' && !d.type
  )
  if (usersUpdate) {
    // Get data
    const userModelData = await getWithData(userModel.id, ['users'])

    if (userModelData) {
      // Deleted users
      const deleted = userModelData.users.filter(
        (u) => !usersUpdate.value.includes(u.id)
      )

      for (const user of deleted) await deleteFromUser(user.id, userModel)

      // Added users
      const added = usersUpdate.value.filter(
        (u) => !userModelData.users.find((user) => user.id === u)
      )

      for (const user of added) await addToUser(user, userModel)
    }
  }

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
  const data = await getWithData(userModel.id, ['groups', 'users'])

  if (data) {
    // Delete from groups
    for (const group of data.groups) await deleteFromGroup(group.id, userModel)

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
