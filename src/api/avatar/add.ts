import { call, CallResponse } from '@/api/call'

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
): Promise<CallResponse> =>
  call('/api/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ file, project })
  })
