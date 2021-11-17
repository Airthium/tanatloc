import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @memberof API.User
 * @param {Array} data Data `[{ key, value }, ...]`
 */
export const update = async (data: IDataBaseEntry[]): Promise<void> => {
  await call('/api/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
