import { call } from '@/api/call'

/**
 * Delete group
 * @memberof API.Group
 * @param {Object} group Group `{ id }`
 */
export const del = async (group: { id: string }): Promise<void> => {
  await call('/api/group', {
    method: 'DELETE',
    body: JSON.stringify(group)
  })
}
