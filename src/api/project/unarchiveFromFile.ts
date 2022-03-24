/** @module API.Project.UnarchiveFromFile */

import { ICallResponse } from '../index.d'

import { call } from '@/api/call'

/**
 * Unarchive from file
 * @param project Project
 * @returns Response
 */
export const unarchiveFromFile = async (
  project: {
    id: string
  },
  archive: Buffer
): Promise<ICallResponse> => {
  return call('/api/project/' + project.id + '/archive', {
    method: 'POST',
    body: JSON.stringify({ archive })
  })
}
