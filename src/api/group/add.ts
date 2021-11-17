import { INewGroup } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add group
 * @memberof API.Group
 * @param {Object} organization Organization `{ id }`
 * @param {Object} group Group `{ name, users }`
 * @returns {Object} Group `{ id, name, users, organization }`
 */
export const add = async (
  organization: { id: string },
  group: { name: string; users: string[] }
): Promise<INewGroup> => {
  const response = await call('/api/group', {
    method: 'POST',
    body: JSON.stringify({ organization, group })
  })

  return response.json()
}
