/** @module Database.Project.Update */

import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @param project Project
 * @param data Data
 */
export const update = async (
  project: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.PROJECTS, project.id, data)
}
