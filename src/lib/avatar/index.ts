/** @namespace Lib.Avatar */

import path from 'path'

import { AVATAR } from '@/config/storage'

import AvatarDB from '@/database/avatar'
import type { IAvatar, INewAvatar } from '@/database/index.d'

import User from '../user'
import Project from '../project'
import Tools from '../tools'

/**
 * Add
 * @memberof Lib.Avatar
 * @param parent Parent
 * @param type Type
 * @param file File
 * @returns New avatar
 */
const add = async (
  parent: { id: string },
  type: string,
  file: { name: string; uid: string; data: Buffer }
): Promise<INewAvatar> => {
  // Write file
  await Tools.writeFile(AVATAR, file.uid, file.data)

  // Add in dB
  const avatar = await AvatarDB.add({ name: file.name, path: file.uid })

  if (type === 'user') {
    // Check existing avatar in user, if exists: delete
    const userData = await User.get(parent.id, ['avatar'])
    if (userData.avatar) await del(parent, type, userData.avatar)

    // Update user
    await User.update(parent, [{ key: 'avatar', value: avatar.id }])
  } else {
    // Check existing avatar in project, if exists: delete
    const projectData = await Project.get(parent.id, ['avatar'])
    if (projectData.avatar) await del(parent, type, projectData.avatar)

    // Update project
    await Project.update(parent, [{ key: 'avatar', value: avatar.id }])
  }

  // Return avatar
  return avatar
}

/**
 * Read
 * @memberof Lib.Avatar
 * @param id Avatar id
 * @returns Content
 */
const read = async (id: string): Promise<Buffer> => {
  // Get path
  const avatar = await get(id, ['path'])
  if (!avatar) throw new Error('Avatar does not exist.')

  // Read file
  const avatarFile = path.join(AVATAR, avatar.path)
  return Tools.readFile(avatarFile)
}

/**
 * Get
 * @memberof Lib.Avatar
 * @param id Id
 * @param data Data
 * @returns Avatar
 */
const get = async (id: string, data: Array<string>): Promise<IAvatar> => {
  return AvatarDB.get(id, data)
}

/**
 * Delete
 * @memberof Lib.Avatar
 * @param parent Parent
 * @param type Type (project or user)
 * @param id Avatar id
 */
const del = async (
  parent: { id: string },
  type: string,
  id: string
): Promise<void> => {
  // Get
  const data = await get(id, ['path'])

  // Remove file
  if (data?.path) {
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
  } else {
    // Update project
    await Project.update(parent, [
      {
        key: 'avatar',
        value: null
      }
    ])
  }

  // Delete avatar
  await AvatarDB.del({ id })
}

/**
 * Archive
 * @param avatar Avatar
 * @param to Target
 */
const archive = async (avatar: { id: string }, to: string): Promise<void> => {
  // Data
  const data = await get(avatar.id, ['path'])

  if (data.path) {
    //copy
    await Tools.copyFile(
      {
        path: AVATAR,
        file: data.path
      },
      { path: to, file: data.path }
    )
    //remove
    await Tools.removeFile(path.join(AVATAR, data.path))
  }
}

const Avatar = { add, read, get, del, archive }
export default Avatar
