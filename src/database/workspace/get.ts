/** @module Database.Workspace.Get */

import { IWorkspace } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Workspace
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
