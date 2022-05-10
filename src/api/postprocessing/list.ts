/** @module API.Postprocessing.List */

import { IPostProcessing } from 'postprocessing'

import { call } from '@/api/call'

export const list = async (): Promise<IPostProcessing> => {
  const response = await call('/api/postprocessing', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  return response.json()
}
