import { deleter } from '..'
import { databases } from '@/config/db'

/**
 * Delete avatar
 * @memberof module:src/database/avatar
 * @param {Object} avatar Avatar { id }
 */
const del = async (avatar) => {
  await deleter(databases.AVATARS, avatar.id)
}

export default del
