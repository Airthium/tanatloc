/** @module Database.Project.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param project Project
 */
export const del = async (project: { id: string }): Promise<void> => {
  await deleter(tables.PROJECTS, project.id)
}
