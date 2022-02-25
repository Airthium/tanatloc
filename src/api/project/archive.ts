/** @module API.Project.Archive */

import { ICallResponse } from '../index.d'

import { call } from '@/api/call'

/**
 * Archive
 * @memberof API.Project
 * @param project Project
 * @returns Response
 */
export const archive = async (project: {
  id: string
}): Promise<ICallResponse> => {
  return call('/api/project/' + project.id + '/archive', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}
