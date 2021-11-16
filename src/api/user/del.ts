import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.User
 */
export const del = async (): Promise<void> => {
  await call('/api/user', {
    method: 'DELETE'
  })
}
