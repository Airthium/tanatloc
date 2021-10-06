/** @namespace Lib.User */

import UserDB from '@/database/user'

import Avatar from '../avatar'
import Group from '../group'
import Workspace from '../workspace'
import Email from '../email'

/**
 * Add
 * @memberof Lib.User
 * @param {Object} user `{ email, password }`
 * @returns {Object} User `{ alreadyExists: true } || { id, email }`
 */
const add = async ({ email, password }) => {
  const user = await UserDB.add({ email, password })
  if (!user.alreadyExists) {
    // Send email
    await Email.subscribe(email, user.id)
  }

  return user
}

/**
 * Get
 * @memberof Lib.User
 * @param {string} id User id
 * @param {Array} data Data
 * @param {boolean} [withData=true] With data
 * @returns {Object} User `{ id, ...data }`
 */
const get = async (id, data, withData = true) => {
  const user = await UserDB.get(id, data)

  // Get avatar
  if (withData && user && user.avatar) {
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
 * Get by key
 * @memberof Lib.User
 * @param {string} key key
 * @param {Array} data Data
 * @param {string} keyName Key name
 * @returns {Object} `{ key, ...data }`
 */
const getBy = async (key, data, keyName) => {
  return UserDB.get(key, data, keyName)
}

/**
 * Get all
 * @memberof Lib.User
 * @param {Array} data Data
 * @returns {Array} Users
 */
const getAll = async (data) => {
  return UserDB.getAll(data)
}

/**
 * Login
 * @memberof Lib.User
 * @param {Object} data Data `{ email, password }`
 * @returns {Object} User `{ id, email }`
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
 * Update
 * @memberof Lib.User
 * @param {Object} user user `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ...]`
 */
const update = async (user, data) => {
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
  console.log(user)
  console.log(data)

  await UserDB.update(user, data)
}

/**
 * Delete user
 * @memberof Lib.User
 * @param {Object} user User `{ id }`
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
