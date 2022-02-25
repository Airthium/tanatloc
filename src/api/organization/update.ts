/** @module API.Organization.Update */

import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @param Organization Organization
 * @param data Data
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
