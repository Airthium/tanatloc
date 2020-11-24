/** @module src/lib/avatar */

import path from 'path'

import { AVATAR } from '../../config/storage'

import AvatarDB from '../database/avatar'

import User from './user'
import Tools from './tools'

/**
 * Add avatar
 * @param {Object} user User { id }
 * @param {File} file File { name, uid, data }
 */
const add = async (user, file) => {
  // Write file
  await Tools.writeFile(AVATAR, file.uid, file.data)

  // Add in dB
  const avatarPath = path.join(AVATAR, file.uid)
  const avatar = await AvatarDB.add({ name: file.name, path: avatarPath })

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
  const avatar = await AvatarDB.get(id, ['path'])

  // Read file
  const content = await Tools.readFile(avatar.path)

  // Return
  return content
}

/**
 * Delete avatar
 * @param {Object} user User { id }
 * @param {string} id Avatar's id
 */
const del = async (user, id) => {
  // Delete avatar
  await AvatarDB.del(id)

  // Update user
  await User.update(user, {
    data: [
      {
        key: 'avatar',
        value: null
      }
    ]
  })
}

export default { add, read, del }
