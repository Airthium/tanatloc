/** @module Database.Workspace.Update */

import { IDataBaseEntry } from '../index.d'

import { tables } from '@/config/db'

import { updater } from '..'

/**
 * Update
 * @param workspace workspace
 * @param data Data
 */
export const update = async (
  workspace: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.WORKSPACES, workspace.id, data)
}
