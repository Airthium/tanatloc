/** @module API.Link.Process */

import { call } from '@/api/call'

/**
 * Process
 * @param id Id
 * @param data Data
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
