import { call } from '../call'

/**
 * Delete avatar
 * @memberof module:src/api/avatar
 * @param {Object} avatar Avatar { id }
 */
const del = async (avatar) => {
  return call('/api/avatar', {
    method: 'DELETE',
    body: JSON.stringify(avatar)
  })
}
export default del
