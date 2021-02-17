/** @module src/lib/user */

import UserDB from '@/database/user'

import Avatar from './avatar'
import Workspace from './workspace'

/**
 * Add user
 * @param {Object} user { username, password }
 */
const add = async ({ username, password }) => {
  return UserDB.add({ username, password })
}

/**
 * Get user
 * @param {string} id User's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const user = await UserDB.get(id, data)

  // Get avatar
  if (user && user.avatar) {
    try {
      const avatar = await Avatar.read(user.avatar)
      user.avatar = avatar
    } catch (err) {
      console.warn(err)
      user.avatar = undefined
    }
  }

  // Return
  return user
}

/**
 * Get all users
 * @param {Array} data Data
 */
const getAll = async (data) => {
  return UserDB.getAll(data)
}

/**
 * Login
 * @param {Object} data Data { username, password }
 */
const login = async ({ username, password }) => {
  const user = await UserDB.getByUsernameAndPassword({ username, password })

  // Check user
  if (!user) return null

  // Return
  return {
    ...user,
    username: username
  }
}

/**
 * Update user
 * @param {Object} user user { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (user, data) => {
  await UserDB.update(user, data)
}

/**
 * Delete user
 * @param {Object} user User { id }
 */
const del = async (user) => {
  // Get data
  const data = await get(user.id, ['workspaces'])

  // Delete workspaces
  if (data.workspaces) {
    await Promise.all(
      data.workspaces.map(async (workspace) => {
        await Workspace.del(user, { id: workspace })
      })
    )
  }

  // Delete avatar
  // TODO

  // Delete user
  await UserDB.del(user)
}

export default { login, add, get, getAll, update, del }
