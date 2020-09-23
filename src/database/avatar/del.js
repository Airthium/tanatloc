import { deleter } from '..'
import { databases } from '../../../config/db'

/**
 * Delete avatar
 * @param {Object} avatar { id }
 */
const del = async (avatar) => {
  await deleter(databases.AVATARS, avatar.id)
}

export default del
