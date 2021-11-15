import { tables } from '@/config/db'

import { updater } from '..'
import { IDataBaseEntry } from '../index.d'

/**
 * Update
 * @memberof Database.Project
 * @param {Object} project Project `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  project: { id: string },
  data: Array<IDataBaseEntry>
): Promise<void> => {
  await updater(tables.PROJECTS, project.id, data)
}
