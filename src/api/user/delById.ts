import { call } from '@/api/call'

/**
 * Delete by id
 * @memberof API.User
 */
export const delById = async (id: string): Promise<void> => {
  await call('/api/user/' + id, {
    method: 'DELETE'
  })
}
