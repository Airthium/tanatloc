import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get by user id
 * @memberof module:database/workspace
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(tables.WORKSPACES, id, data)

  const workspace = response.rows[0]
  workspace && (workspace.id = id)

  return workspace
}

export default get
