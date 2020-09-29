/** @module src/lib/avatar */

import { promises as fs } from 'fs'

import { AVATAR } from '../../config/storage'

import { add as dBadd, get as dBget, del as dBdel } from '../database/avatar'
import { get as getUser, update as updateUser } from './user'
import { writeFile } from './tools'

/**
 * Add avatar
 * @param {Object} user User { id }
 * @param {File} file File { name, uid, data }
 */
const add = async (user, file) => {
  // Write file
  await writeFile(AVATAR, file.uid, file.data)

  // Add in dB
  const avatar = await dBadd({ name: file.name, path: avatarPath })

  // Check existing avatar in user, if exists: delete
  const userData = await getUser(user.id, ['avatar'])
  if (userData.avatar) await del(user, userData.avatar)

  // Update user
  await updateUser(user, [{ key: 'avatar', value: avatar.id }])

  // Return avatar
  return avatar
}

/**
 * Read avatar
 * @param {string} id Avatar's id
 */
const read = async (id) => {
  // Get path
  const avatar = await dBget(id, ['path'])

  // Read file
  const content = await fs.readFile(avatar.path)

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
  await dBdel(id)

  // Update user
  await updateUser(user, {
    data: [
      {
        key: 'avatar',
        value: null
      }
    ]
  })
}

export { add, read, del }
