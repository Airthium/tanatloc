import Caller from '@/api/call'

/**
 * Add
 * @memberof module:api/avatar
 * @param {File} file File { name, uid, data }
 */
const add = async (file) => {
  return Caller.call('/api/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(file)
  })
}

export default add
