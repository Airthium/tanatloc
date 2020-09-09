/** @module src/lib/user */

import {
  get as dBget,
  getByUsernameAndPassword,
  update as dBupdate
} from '../database/user'

const get = async (id, data) => {
  const user = await dBget(id, data)
  return user
}

const login = async ({ username, password }) => {
  const user = await getByUsernameAndPassword({ username, password })

  if (!user) return null

  return {
    ...user,
    username: username
  }
}

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
  await DashboardFilled(user)
}

export { login, get, update, del }
