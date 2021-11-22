import { call } from '@/api/call'

/**
 * Delete group
 * @memberof API.Organization
 * @param organization Organization
 */
export const del = async (organization: { id: string }): Promise<void> => {
  await call('/api/organization', {
    method: 'DELETE',
    body: JSON.stringify(organization)
  })
}
