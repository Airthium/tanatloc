/** @module src/lib/avatar */

import path from 'path'

import { AVATAR } from '@/config/storage'

import AvatarDB from '@/database/avatar'

import User from '../user'
import Tools from '../tools'

/**
 * Add avatar
 * @param {Object} user User { id }
 * @param {File} file File { name, uid, data }
 */
const add = async (user, file) => {
  // Write file
  await Tools.writeFile(AVATAR, file.uid, file.data)

  // Add in dB
  const avatar = await AvatarDB.add({ name: file.name, path: file.uid })

  // Check existing avatar in user, if exists: delete
  const userData = await User.get(user.id, ['avatar'])
  if (userData.avatar) await del(user, userData.avatar)

  // Update user
  await User.update(user, [{ key: 'avatar', value: avatar.id }])

  // Return avatar
  return avatar
}

/**
 * Read avatar
 * @param {string} id Avatar's id
 */
const read = async (id) => {
  // Get path
  const avatar = await get(id, ['path'])

  // Read file
  const avatarFile = path.join(AVATAR, avatar.path)
  return Tools.readFile(avatarFile)
}

/**
 * Get
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  return AvatarDB.get(id, data)
}

/**
 * Delete avatar
 * @param {Object} user User { id }
 * @param {string} id Avatar's id
 */
const del = async (user, id) => {
  // Get
  const data = await get(id, ['path'])

  // Delete avatar
  await AvatarDB.del(id)

  // Remove file
  if (data.path) {
    const avatarFile = path.join(AVATAR, data.path)
    await Tools.removeFile(avatarFile)
  }

  // Update user
  await User.update(user, {
    data: [
      {
        key: 'avatar',
        value: null
      }
    ]
  })

  // Remove avatar file
}

export default { add, read, get, del }
