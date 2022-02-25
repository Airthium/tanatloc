/** @module API.Group.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param group Group
 */
export const del = async (group: { id: string }): Promise<void> => {
  await call('/api/group', {
    method: 'DELETE',
    body: JSON.stringify(group)
  })
}
