import { call } from '@/api/call'
import { ICallResponse } from '..'

/**
 * Add
 * @memberof API.Avatar
 * @param {File} file File `{ name, uid, data }`
 * @param {Object} [project] Project `{ id }`
 * @returns {Object} Avatar `{ id, name }`
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
