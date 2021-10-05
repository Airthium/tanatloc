import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Avatar
 * @param {Object} avatar Avatar `{ id }`
 */
const del = async (avatar) => {
  await deleter(tables.AVATARS, avatar.id)
}

export default del
