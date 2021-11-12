import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.Workspace
 * @param {Object} workspace workspace `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ... ]`
 */
export const update = async (
  workspace: { id: string },
  data: Array<DataBaseEntry>
): Promise<void> => {
  await updater(tables.WORKSPACES, workspace.id, data)
}
