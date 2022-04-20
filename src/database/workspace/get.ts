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

export type TWorkspaceGetName = 'name'[]
export type TWorkspaceGetOwners = 'owners'[]
export type TWorkspaceGetUsers = 'users'[]
export type TWorkspaceGetGroups = 'groups'[]
export type TWorkspaceGetProjects = 'projects'[]
export type TWorkspaceGetArchivedprojects = 'archivedprojects'[]

export interface IWorkspace<T = []> {
  id: string
  name: TWorkspaceGetName extends T ? string : never
  owners: TWorkspaceGetOwners extends T ? string[] : never[]
  users?: TWorkspaceGetUsers extends T ? string[] : never[]
  groups?: TWorkspaceGetGroups extends T ? string[] : never[]
  projects?: TWorkspaceGetProjects extends T ? string[] : never[]
  archivedprojects?: TWorkspaceGetArchivedprojects extends T
    ? object[]
    : never[]
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
