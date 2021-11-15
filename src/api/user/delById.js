import { call } from '@/api/call'

/**
 * Delete by id
 * @memberof API.User
 */
const delById = async (id) => {
  await call('/api/user/' + id, {
    method: 'DELETE'
  })
}

export default delById
