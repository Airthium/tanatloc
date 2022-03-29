/** @module API.Organization.Quit */

import { call } from '@/api/call'

/**
 * Update
 * @param organization Organization
 */
export const quit = async (organization: { id: string }): Promise<void> => {
  await call('/api/organization/' + organization.id, {
    method: 'DELETE'
  })
}
