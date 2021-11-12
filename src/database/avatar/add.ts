import { tables } from '@/config/db'

import { query } from '..'
import { INewAvatar } from '.'

/**
 * Add
 * @memberof Database.Avatar
 * @param {Object} data Data `{ name, path }`
 * @returns {Object} Avatar `{ id, name }`
 */
export const add = async (avatar: {
  name: string
  path: string
}): Promise<INewAvatar> => {
  const response = await query(
    'INSERT INTO ' +
      tables.AVATARS +
      ' (name, path) VALUES ($1, $2) RETURNING id',
    [avatar.name, avatar.path]
  )

  const newAvatar = response.rows[0]
  newAvatar && (newAvatar.name = avatar.name)

  return newAvatar
}
