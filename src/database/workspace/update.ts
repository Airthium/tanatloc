import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.Workspace
 * @param {Object} workspace workspace `{ id }`
 * @param {Object} data Data `[{ key, value, ... }, ... ]`
 */
export const update = async (
  workspace: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.WORKSPACES, workspace.id, data)
}
