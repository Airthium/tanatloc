import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update items
 * @memberof API.System
 * @param {string} data Data
 */
export const update = async (data: IDataBaseEntry[]): Promise<void> => {
  await call('/api/system', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
