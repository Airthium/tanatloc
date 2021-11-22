import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update by id
 * @memberof API.User
 * @param id User id
 * @param data Data
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
