/** @module API.Project.DeleteArchive */

import { ICallResponse } from '../index.d'

import { call } from '@/api/call'

/**
 * Delete archive from server
 * @param project Project
 * @returns Response
 */
export const deleteArchiveFile = async (project: {
  id: string
}): Promise<ICallResponse> => {
  return call('/api/project/' + project.id + '/archive', {
    method: 'DELETE'
  })
}
