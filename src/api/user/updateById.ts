import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update by id
 * @memberof API.User
 * @param {string} id User id
 * @param {Array} data Data `[{ key: value }, ...]`
 */
export const updateById = async (
  id: string,
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/user/' + id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
