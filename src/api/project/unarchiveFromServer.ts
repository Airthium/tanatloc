/** @module API.Project.Archive */

import { ICallResponse } from '../index.d'

import { call } from '@/api/call'

/**
 * Unarchive from server
 * @param project Project
 * @returns Response
 */
export const unarchiveFromServer = async (project: {
  id: string
}): Promise<ICallResponse> => {
  return call('/api/project/' + project.id + '/unarchiveFromServer', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}
