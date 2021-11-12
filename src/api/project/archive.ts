import { call, CallResponse } from '@/api/call'

/**
 * Archive
 * @memberof API.Project
 * @param {Object} project Project `{ id }`
 * @returns {Object} Response `{ blob }`
 */
export const archive = async (project: {
  id: string
}): Promise<CallResponse> => {
  return call('/api/project/' + project.id + '/archive', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}
