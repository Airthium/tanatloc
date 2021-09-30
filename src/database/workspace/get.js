import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.Workspace
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Workspace { id, ...data }
 */
const get = async (id, data) => {
  const response = await getter(tables.WORKSPACES, id, data)

  const workspace = response.rows[0]
  workspace && (workspace.id = id)

  return workspace
}

export default get
