import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Organization
 * @param {Object} organization Organization { id }
 */
const del = async (organization) => {
  await deleter(tables.ORGANIZATIONS, organization.id)
}

export default del
