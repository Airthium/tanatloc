/** @module lib/user */

import UserDB from '@/database/user'

import Avatar from '../avatar'
import Group from '../group'
import Workspace from '../workspace'

/**
 * Add user
 * @param {Object} user { email, password }
 */
const add = async ({ email, password }) => {
  return UserDB.add({ email, password })
}

/**
 * Get user
 * @param {string} id User's id
 * @param {Array} data Data
 * @param {boolean} readAvatar Read avatar ? (default: true)
 */
const get = async (id, data, readAvatar = true) => {
  const user = await UserDB.get(id, data)

  // Get avatar
  if (readAvatar && user && user.avatar) {
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

const getBy = async (id, data, key) => {
  return UserDB.get(id, data, key)
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
 * @param {Object} data Data { email, password }
 */
const login = async ({ email, password }) => {
  const user = await UserDB.getByUsernameAndPassword({ email, password })

  // Check user
  if (!user) return null

  // Return
  return {
    ...user,
    email: email
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
  const data = await get(user.id, ['workspaces', 'avatar'], false)

  // Delete from groups
  if (data.groups) {
    await Promise.all(
      data.groups.map(async (group) => {
        await Group.update({ id: group }, [
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
    await Avatar.del(user, data.avatar)
  }

  // Delete user
  await UserDB.del(user)
}

const User = { login, add, get, getBy, getAll, update, del }
export default User
