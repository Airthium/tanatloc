/** @module API.Group.Add */

import { INewGroup } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @param organization Organization
 * @param group Group
 * @returns New group
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
