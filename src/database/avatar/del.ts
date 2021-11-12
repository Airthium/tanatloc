import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Avatar
 * @param {Object} avatar Avatar `{ id }`
 */
export const del = async (avatar: { id: string }): Promise<void> => {
  await deleter(tables.AVATARS, avatar.id)
}
