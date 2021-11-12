import { tables } from '@/config/db'

import { DataBaseEntry, updater } from '..'

/**
 * Update
 * @memberof Database.Project
 * @param {Object} project Project `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  project: { id: string },
  data: Array<DataBaseEntry>
): Promise<void> => {
  await updater(tables.PROJECTS, project.id, data)
}
