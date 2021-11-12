import { tables } from '@/config/db'

import { getter } from '..'
import { IAvatar } from '.'

/**
 * Get
 * @memberof Database.Avatar
 * @param {string} id Avatar's id
 * @param {Array} data Data
 * @returns {Object} Avatar `{ id, ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<IAvatar> => {
  const response = await getter(tables.AVATARS, id, data)

  const avatar = response.rows[0]
  avatar && (avatar.id = id)

  return avatar
}
