/** @module API.Organization.Accept */

import { call } from '@/api/call'

/**
 * Update
 * @param organization Organization
 */
export const accept = async (organization: { id: string }): Promise<void> => {
  await call('/api/organization/' + organization.id, {
    method: 'PUT'
  })
}
