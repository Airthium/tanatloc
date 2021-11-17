import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Organization
 * @param {Object} Organization Organization `{ id }`
 * @param {Array} data Data
 */
export const update = async (
  organization: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/organization', {
    method: 'PUT',
    body: JSON.stringify({ organization, data })
  })
}
