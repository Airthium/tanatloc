/** @module lib/avatar */

import path from 'path'

import { AVATAR } from '@/config/storage'

import AvatarDB from '@/database/avatar'

import User from '../user'
import Project from '../project'
import Tools from '../tools'

/**
 * Add avatar
 * @param {Object} parent Parent { id }
 * @param {string} type Type (project or user)
 * @param {File} file File { name, uid, data }
 */
const add = async (parent, type, file) => {
  // Write file
  await Tools.writeFile(AVATAR, file.uid, file.data)

  // Add in dB
  const avatar = await AvatarDB.add({ name: file.name, path: file.uid })

  if (type === 'user') {
    // Check existing avatar in user, if exists: delete
    const userData = await User.get(parent.id, ['avatar'], false)
    if (userData.avatar) await del(parent, type, userData.avatar)

    // Update user
    await User.update(parent, [{ key: 'avatar', value: avatar.id }])
  } else if (type === 'project') {
    // Check existing avatar in project, if exists: delete
    const projectData = await Project.get(parent.id, ['avatar'], false)
    if (projectData.avatar) await del(parent, type, projectData.avatar)

    // Update project
    await Project.update(parent, [{ key: 'avatar', value: avatar.id }])
  }

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
 * @param {Object} parent Parent { id }
 * @param {string} type Type (project or user)
 * @param {string} id Avatar's id
 */
const del = async (parent, type, id) => {
  // Get
  const data = await get(id, ['path'])

  // Remove file
  if (data.path) {
    const avatarFile = path.join(AVATAR, data.path)
    try {
      await Tools.removeFile(avatarFile)
    } catch (err) {
      console.error(err)
    }
  }

  if (type === 'user') {
    // Update user
    await User.update(parent, [
      {
        key: 'avatar',
        value: null
      }
    ])
  } else if (type === 'project') {
    // Update project
    await Project.update(parent, [
      {
        key: 'avatar',
        value: null
      }
    ])
  }

  // Delete avatar
  await AvatarDB.del(id)
}

export default { add, read, get, del }
