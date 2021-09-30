import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.Organization
 * @param {Object} organization Organization { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (organization, data) => {
  await updater(tables.ORGANIZATIONS, organization.id, data)
}

export default update
