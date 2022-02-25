/** @module Database.Avatar.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param avatar Avatar
 */
export const del = async (avatar: { id: string }): Promise<void> => {
  await deleter(tables.AVATARS, avatar.id)
}
