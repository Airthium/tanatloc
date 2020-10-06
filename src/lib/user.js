/** @module src/lib/user */

import {
  get as dBget,
  getByUsernameAndPassword,
  update as dBupdate,
  del as dBdel
} from '../database/user'
import { read as readAvatar } from './avatar'

/**
 * Add user (TODO)
 */
const add = () => {}

/**
 * Get user
 * @param {string} id User's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const user = await dBget(id, data)

  // Get avatar
  if (user.avatar) {
    try {
      const avatar = await readAvatar(user.avatar)
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
 * Login
 * @param {Object} data Data { username, password }
 */
const login = async ({ username, password }) => {
  const user = await getByUsernameAndPassword({ username, password })

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
  await dBupdate(user, data)
}

/**
 * Delete user
 * @param {Object} user User { id }
 */
const del = async (user) => {
  await dBdel(user)
}

export { login, add, get, update, del }
