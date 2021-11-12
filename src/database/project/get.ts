import { tables } from '@/config/db'

import { getter } from '..'

type Project = {
  id: string
  archived?: boolean
  title?: string
  description?: string
  avatar?: string
  public?: boolean
  history?: object
  createddate?: Date
  lastaccess?: Date
  geometries?: Array<string>
  simulations?: Array<string>
  owners?: Array<string>
  users?: Array<string>
  groups?: Array<string>
  workspace?: string
}

/**
 * Get
 * @memberof Database.Project
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Project `{ id, ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<Project> => {
  const response = await getter(tables.PROJECTS, id, data)

  const project = response.rows[0]
  project && (project.id = id)

  return project
}
