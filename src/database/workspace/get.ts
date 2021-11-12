import { tables } from '@/config/db'

import { getter } from '..'

type Workspace = {
  id: string
  name?: string
  owners?: Array<string>
  users?: Array<string>
  groups?: Array<string>
  projects?: Array<string>
  archivedprojects?: Array<object>
}

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
): Promise<Workspace> => {
  const response = await getter(tables.WORKSPACES, id, data)

  const workspace = response.rows[0]
  workspace && (workspace.id = id)

  return workspace
}
