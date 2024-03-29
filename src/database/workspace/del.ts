/** @module Database.Workspace.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param workspace Workspace
 */
export const del = async (workspace: { id: string }): Promise<void> => {
  // Delete workspace
  await deleter(tables.WORKSPACES, workspace.id)
}
