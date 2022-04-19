/** @module Database.Project.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TProjectGet = (
  | 'archived'
  | 'title'
  | 'description'
  | 'avatar'
  | 'public'
  | 'history'
  | 'createdate'
  | 'lastaccess'
  | 'geometries'
  | 'simulations'
  | 'owners'
  | 'users'
  | 'groups'
  | 'workspace'
)[]

export interface IProject<T> {
  id: string
  archived?: T extends ['archived'] ? boolean : never
  title: T extends ['title'] ? string : never
  description?: T extends ['description'] ? string : never
  avatar?: T extends ['avatar'] ? string : never
  public?: T extends ['public'] ? boolean : never
  history?: T extends ['history'] ? object : never
  createddate: T extends ['createddate'] ? Date : never
  lastaccess: T extends ['lastaccess'] ? Date : never
  geometries?: T extends ['geometries'] ? string[] : never[]
  simulations?: T extends ['simulations'] ? string[] : never[]
  owners: T extends ['owners'] ? string[] : never[]
  users?: T extends ['users'] ? string[] : never[]
  groups?: T extends ['groups'] ? string[] : never[]
  workspace: T extends ['workspace'] ? string : never
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Project
 */
export const get = async <T extends TProjectGet>(
  id: string,
  data: T
): Promise<IProject<T>> => {
  const response = await getter(tables.PROJECTS, id, data)

  const project = response.rows[0]
  project && (project.id = id)

  return project
}
