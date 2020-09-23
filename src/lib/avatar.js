import path from 'path'
import { promises as fs } from 'fs'

import { AVATAR } from '../../config/storage'

import { add as dBadd, get as dBget, del as dBdel } from '../database/avatar'
import { get as getUser, update as updateUser } from './user'

const add = async (user, file) => {
  // Write file
  const avatarPath = path.join(AVATAR, file.uid)
  await fs.writeFile(avatarPath, file.data)

  // Add
  const avatar = await dBadd({ name: file.name, path: avatarPath })

  // Check existing avatar in user
  const userData = await getUser(user.id, ['avatar'])
  if (userData.avatar) await del(user, userData.avatar)

  // Update user
  await updateUser(user, { data: [{ key: 'avatar', value: avatar.id }] })

  return avatar
}

const read = async (id) => {
  // Get path
  const avatar = await dBget(id, ['path'])

  // Read file
  const content = await fs.readFile(avatar.path)
  return content.toString()
}

const del = async (user, id) => {
  // Delete avatar
  await dBdel(id)

  // Update user
  await updateUser(user.id, {
    data: [
      {
        key: 'avatar',
        value: null
      }
    ]
  })
}

export { add, read, del }
