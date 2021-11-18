import { tables } from '@/config/db'

import { getter } from '..'
import { IProject } from '../index.d'

/**
 * Get
 * @memberof Database.Project
 * @param id Id
 * @param data Data
 * @returns Project
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<IProject> => {
  const response = await getter(tables.PROJECTS, id, data)

  const project = response.rows[0]
  project && (project.id = id)

  return project
}
