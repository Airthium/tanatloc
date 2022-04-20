/** @module Database.Group.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TGroupGet = (
  | 'name'
  | 'users'
  | 'workspaces'
  | 'projects'
  | 'organization'
)[]

export type TGroupGetName = 'name'[]
export type TGroupGetUsers = 'users'[]
export type TGroupGetWorkspaces = 'workspaces'[]
export type TGroupGetProjects = 'projects'[]
export type TGroupGetOrganization = 'organization'[]

export interface IGroup<T = []> {
  id: string
  name: TGroupGetName extends T ? string : never
  users: TGroupGetUsers extends T ? string[] : never[]
  workspaces?: TGroupGetWorkspaces extends T ? string[] : never[]
  projects?: TGroupGetProjects extends T ? string[] : never[]
  organization: TGroupGetOrganization extends T ? string : never
}

/**
 * Get
 * @param id Group id
 * @param data Data
 * @returns Group
 */
export const get = async <T extends TGroupGet>(
  id: string,
  data: T
): Promise<IGroup<T>> => {
  const response = await getter(tables.GROUPS, id, data)

  const group = response.rows[0]
  group && (group.id = id)

  return group
}
