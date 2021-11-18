import { tables } from '@/config/db'

import { getter } from '..'
import { IAvatar } from '../index.d'

/**
 * Get
 * @memberof Database.Avatar
 * @param id Avatar id
 * @param data Data
 * @returns Avatar
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
