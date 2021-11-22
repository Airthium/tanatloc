import { ICallResponse } from '..'

import { call } from '@/api/call'

/**
 * Download
 * @memberof API.Result
 * @param simulation Simulation
 * @param result Result
 * @returns Download read stream
 */
export const download = async (
  simulation: { id: string },
  result: { originPath: string; fileName: string }
): Promise<ICallResponse> => {
  return call('/api/result/download', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}
