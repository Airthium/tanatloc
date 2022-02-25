/** @module Lib.User */

import { IDataBaseEntry, INewUser, IUser, IUserCheck } from '@/database/index.d'
import { IUserWithData } from '../index.d'

import UserDB from '@/database/user'

import Avatar from '../avatar'
import Organization from '../organization'
import Workspace from '../workspace'
import Email from '../email'

/**
 * Add
 * @param user User
 * @returns New user
 */
const add = async (user: {
  email: string
  password: string
}): Promise<INewUser> => {
  const newUser = await UserDB.add(user)
  if (!newUser.alreadyExists) {
    // Send email
    await Email.subscribe(user.email, newUser.id)
  }

  return newUser
}

/**
 * Get
 * @param id User id
 * @param data Data
 * @returns User
 */
const get = async (id: string, data: Array<string>): Promise<IUser> => {
  return UserDB.get(id, data)
}

/**
 * Get with data (avatar)
 * @param id User id
 * @param data Data
 * @returns User
 */
const getWithData = async (
  id: string,
  data: Array<string>
): Promise<IUserWithData> => {
  const user = await get(id, data)

  const { avatar, ...userData } = { ...user }
  const userWithData: IUserWithData = {
    ...userData
  }
  // Get avatar
  if (avatar) {
    try {
      const avatarData = await Avatar.read(avatar)
      userWithData.avatar = avatarData
    } catch (err) {
      console.warn(err)
      user.avatar = undefined
    }
  }

  // Return
  return userWithData
}

/**
 * Get by key
 * @param key key
 * @param data Data
 * @param keyName Key name
 * @returns User
 */
const getBy = async (
  key: string,
  data: Array<string>,
  keyName: string
): Promise<IUser> => {
  return UserDB.get(key, data, keyName)
}

/**
 * Get all
 * @param data Data
 * @returns Users
 */
const getAll = async (data: string[]): Promise<IUser[]> => {
  return UserDB.getAll(data)
}

/**
 * Login
 * @param user User
 * @returns Logged user
 */
const login = async (user: {
  email: string
  password: string
}): Promise<IUserCheck & { email: string }> => {
  const loggedUser = await UserDB.getByUsernameAndPassword(user)

  // Check user
  if (!loggedUser) return null

  // Return
  return {
    ...loggedUser,
    email: user.email
  }
}

/**
 * Update
 * @param user User
 * @param data Data
 */
const update = async (
  user: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Check email change
  const emailData = data.find((d) => d.key === 'email')
  if (emailData) {
    // Revalidate email
    await Email.revalidate(emailData.value, user.id)

    data.push({
      key: 'isvalidated',
      value: false
    })
  }

  await UserDB.update(user, data)
}

/**
 * Delete user
 * @param user User
 */
const del = async (user: { id: string }): Promise<void> => {
  // Get data
  const data = await get(user.id, ['workspaces', 'organizations', 'avatar'])

  // Delete from organization
  if (data.organizations) {
    await Promise.all(
      data.organizations.map(async (group) => {
        await Organization.update({ id: group }, [
          {
            key: 'users',
            type: 'array',
            method: 'remove',
            value: user.id
          }
        ])
      })
    )
  }

  // Delete workspaces
  if (data.workspaces) {
    await Promise.all(
      data.workspaces.map(async (workspace) => {
        await Workspace.del(user, { id: workspace })
      })
    )
  }

  // Delete avatar
  if (data.avatar) {
    await Avatar.del(user, 'user', data.avatar)
  }

  // Delete user
  await UserDB.del(user)
}

const User = { login, add, get, getWithData, getBy, getAll, update, del }
export default User
