import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Workspace
 * @param {Object} workspace Workspace `{ id }`
 */
export const del = async (workspace: { id: string }): Promise<void> => {
  // Delete workspace
  await deleter(tables.WORKSPACES, workspace.id)
}
