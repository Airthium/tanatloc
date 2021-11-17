import { ICallResponse } from '..'
import { call } from '@/api/call'

/**
 * Archive
 * @memberof API.Result
 * @param {Object} simulation  Simulation `{ id }`
 * @returns {Object} Archive read stream
 */
export const archive = async (simulation: {
  id: string
}): Promise<ICallResponse> => {
  return call('/api/result/archive', {
    method: 'POST',
    body: JSON.stringify({ simulation })
  })
}
