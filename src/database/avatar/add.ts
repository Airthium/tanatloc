/** @module Database.Avatar.Add */

import { INewAvatar } from '../index.d'

import { tables } from '@/config/db'

import { query } from '..'

/**
 * Add
 * @param data Data
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
