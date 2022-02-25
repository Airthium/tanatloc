/** @module API.Project.Update */

import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update project
 * @param project Project
 * @param data Data
 */
export const update = async (
  project: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/project/' + project.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
