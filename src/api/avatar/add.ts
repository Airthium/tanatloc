import { call } from '@/api/call'
import { ICallResponse } from '..'

/**
 * Add
 * @memberof API.Avatar
 * @param file File
 * @param project Project
 * @returns Avatar
 */
export const add = async (
  file: { name: string; uid: string; data: Buffer },
  project: { id: string }
): Promise<ICallResponse | JSON> =>
  call('/api/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ file, project })
  })
