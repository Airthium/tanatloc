import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Workspace
 * @param workspace Workspace
 * @param data Data
 */
export const update = async (
  workspace: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/workspace', {
    method: 'PUT',
    body: JSON.stringify({ workspace: workspace, data: data })
  })
}
