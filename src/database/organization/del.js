import { deleter } from '..'
import { databases } from '@/config/db'

/**
 * Delete
 * @memberof module:database/organization
 * @param {Object} organization Organization { id }
 */
const del = async (organization) => {
  await deleter(databases.ORGANIZATIONS, organization.id)
}

export default del
