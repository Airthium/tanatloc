/** @module API.Organization.Decline */

import { call } from '@/api/call'

/**
 * Update
 * @param organization Organization
 */
export const decline = async (organization: { id: string }): Promise<void> => {
  await call('/api/organization/' + organization.id, {
    method: 'POST'
  })
}
