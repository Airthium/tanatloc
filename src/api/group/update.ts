import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update group
 * @memberof API.Group
 * @param {Object} group Group `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
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
