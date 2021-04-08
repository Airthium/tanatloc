import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof module:database/organization
 * @param {Object} organization Organization { id }
 */
const del = async (organization) => {
  await deleter(tables.ORGANIZATIONS, organization.id)
}

export default del
