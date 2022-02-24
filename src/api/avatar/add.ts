/** @module API.Avatar.Add */

import { INewAvatar } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @param file File
 * @param project Project
 * @returns Avatar
 */
export const add = async (
  file: { name: string; uid: string; data: string },
  project?: { id: string }
): Promise<INewAvatar> => {
  const response = await call('/api/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ file, project })
  })

  return response.json()
}
