import Caller from '@/api/call'

/**
 * Update other user
 * @memberof module:src/api/user
 * @param {string} id User id
 * @param {Array} data Data [{ key: value }, ...]
 */
const updateOther = async (id, data) => {
  return Caller.call('/api/user/' + id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default updateOther
