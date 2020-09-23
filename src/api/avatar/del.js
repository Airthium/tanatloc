import { call } from '../call'

/**
 * Delete avatar
 * @memberof module:src/api/avatar
 * @param {Object} avatar Avatar
 */
const del = async (avatar) => {
  const res = await call('/api/avatar', {
    method: 'DELETE',
    body: JSON.stringify(avatar)
  })

  return res
}
export default del
