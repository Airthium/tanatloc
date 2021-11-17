import { call } from '@/api/call'

/**
 * Process
 * @memberof API.Link
 * @param {string} id Id
 * @param {Object} data Data `{ email, password }`
 *
 */
export const process = async (
  id: string,
  data?: { email: string; password: string }
): Promise<void> => {
  await call('/api/link', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}
