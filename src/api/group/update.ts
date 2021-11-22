import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update group
 * @memberof API.Group
 * @param group Group
 * @param data Data
 */
export const update = async (
  group: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/group', {
    method: 'PUT',
    body: JSON.stringify({ group, data })
  })
}
