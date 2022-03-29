/** @module API.Organization.Decline */

import { call } from '@/api/call'

/**
 * Update
 * @param organization Organization
 * @param user User
 */
export const decline = async (
  organization: { id: string },
  user: { id: string }
): Promise<void> => {
  await call('/api/organization/' + organization.id, {
    method: 'POST',
    body: JSON.stringify({ user })
  })
}
