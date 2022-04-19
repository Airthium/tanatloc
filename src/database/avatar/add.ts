/** @module Database.Avatar.Add */

import { tables } from '@/config/db'

import { query } from '..'

export interface INewAvatar {
  id: string
  name: string
}

/**
 * Add
 * @param avatar Avatar
 * @returns Avatar
 */
export const add = async (avatar: {
  name: string
  path: string
  type: string
}): Promise<INewAvatar> => {
  const response = await query(
    'INSERT INTO ' +
      tables.AVATARS +
      ' (name, path, type) VALUES ($1, $2, $3) RETURNING id',
    [avatar.name, avatar.path, avatar.type]
  )

  const newAvatar = response.rows[0]
  newAvatar && (newAvatar.name = avatar.name)

  return newAvatar
}
