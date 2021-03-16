import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update
 * @memberof module:database/organization
 * @param {Object} organization Organization { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (organization, data) => {
  return updater(databases.ORGANIZATIONS, organization.id, data)
}

export default update
