import { call } from '@/api/call'

/**
 * Process
 * @memberof API.Link
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
