/** @module src/lib/user */

import {
  get as dBget,
  getByUsernameAndPassword,
  update as dBupdate,
  del as dBdel
} from '../database/user'
import { read as readAvatar } from './avatar'

/**
 * Get user
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const user = await dBget(id, data)

  if (user.avatar) {
    try {
      const avatar = await readAvatar(user.avatar)
      user.avatar = avatar
    } catch (err) {
      console.warn(err)
      user.avatar = undefined
    }
  }

  return user
}

/**
 * Login
 * @param {Object} data Data { username, password }
 */
const login = async ({ username, password }) => {
  const user = await getByUsernameAndPassword({ username, password })

  if (!user) return null

  return {
    ...user,
    username: username
  }
}

/**
 * Add user (TODO)
 */
const add = () => {}

/**
 * Update user
 * @param {Object} user user { id }
 * @param {Object} data Data {data: [{ type, method, key, value }] } }
 */
const update = async (user, { data }) => {
  await dBupdate({ user, data })
}

/**
 * Delete user
 * @param {Object} user User { id }
 */
const del = async (user) => {
  await dBdel(user)
}

export { login, add, get, update, del }
