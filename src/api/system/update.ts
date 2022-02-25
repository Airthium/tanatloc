/** @module API.System.Update */

import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update items
 * @param data Data
 */
export const update = async (data: IDataBaseEntry[]): Promise<void> => {
  await call('/api/system', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
