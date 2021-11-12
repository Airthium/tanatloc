import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Avatar
 * @param {Object} avatar Avatar `{ id }`
 */
export const del = async (avatar: { id: string }): Promise<void> => {
  await deleter(tables.AVATARS, avatar.id)
}

export default del
