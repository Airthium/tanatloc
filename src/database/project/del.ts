import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Project
 * @param project Project
 */
export const del = async (project: { id: string }): Promise<void> => {
  await deleter(tables.PROJECTS, project.id)
}
