/** @module Database.Workspace.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TWorkspaceGet = (
  | 'name'
  | 'owners'
  | 'users'
  | 'groups'
  | 'projects'
  | 'archivedprojects'
)[]

export interface IWorkspace<T> {
  id: string
  name: T extends ['name'] ? string : never
  owners: T extends ['owners'] ? string[] : never[]
  users?: T extends ['users'] ? string[] : never[]
  groups?: T extends ['groups'] ? string[] : never[]
  projects?: T extends ['projects'] ? string[] : never[]
  archivedprojects?: T extends ['archivedprojects'] ? object[] : never[]
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Workspace
 */
export const get = async <T extends TWorkspaceGet>(
  id: string,
  data: T
): Promise<IWorkspace<T>> => {
  const response = await getter(tables.WORKSPACES, id, data)

  const workspace = response.rows[0]
  workspace && (workspace.id = id)

  return workspace
}
