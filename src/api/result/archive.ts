/** @module API.Result.Archive */

import { ICallResponse } from '../index.d'

import { call } from '@/api/call'

/**
 * Archive
 * @param simulation  Simulation
 * @returns Archive read stream
 */
export const archive = async (simulation: {
  id: string
}): Promise<ICallResponse> => {
  return call('/api/result/archive', {
    method: 'POST',
    body: JSON.stringify({ simulation })
  })
}
