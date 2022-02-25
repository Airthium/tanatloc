/** @module API.Organization.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param organization Organization
 */
export const del = async (organization: { id: string }): Promise<void> => {
  await call('/api/organization', {
    method: 'DELETE',
    body: JSON.stringify(organization)
  })
}
