import Caller from '@/api/call'

/**
 * Delete other user
 * @memberof module:src/api/user
 */
const delOther = async (id) => {
  return Caller.call('/api/user/' + id, {
    method: 'DELETE'
  })
}

export default delOther
