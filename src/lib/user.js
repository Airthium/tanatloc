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
 * @param {Object} data { user: { id }, data: [{ type, method, key, value }] }
 */
const update = async ({ user, data }) => {
  await dBupdate({ user, data })
}

export { login, get, update }
