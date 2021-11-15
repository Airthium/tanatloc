import { tables } from '@/config/db'

import { getter } from '..'
import { IWorkspace } from '../index.d'

/**
 * Get
 * @memberof Database.Workspace
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Workspace `{ id, ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<IWorkspace> => {
  const response = await getter(tables.WORKSPACES, id, data)

  const workspace = response.rows[0]
  workspace && (workspace.id = id)

  return workspace
}
