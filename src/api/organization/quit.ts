/** @module API.Organization.Quit */

import { call } from '@/api/call'

/**
 * Update
 * @param organization Organization
 * @param user User
 */
export const quit = async (
  organization: { id: string },
  user: { id: string }
): Promise<void> => {
  await call('/api/organization/' + organization.id, {
    method: 'DELETE',
    body: JSON.stringify({ user })
  })
}
