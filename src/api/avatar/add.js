import Caller from '../call'

/**
 * Add avatar
 * @memberof module:src/api/avatar
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
