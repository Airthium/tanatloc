/** @module API.Organization.Accept */

import { call } from '@/api/call'

/**
 * Update
 * @param organization Organization
 * @param user User
 */
export const accept = async (
  organization: { id: string },
  user: { id: string }
): Promise<void> => {
  await call('/api/organization/' + organization.id, {
    method: 'PUT',
    body: JSON.stringify({ user })
  })
}
