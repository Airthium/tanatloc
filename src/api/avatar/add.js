import Caller from '@/api/call'

/**
 * Add
 * @memberof API.Avatar
 * @param {File} file File `{ name, uid, data }`
 * @param {Object} [project] Project `{ id }`
 * @returns {Object} Avatar `{ id, name }`
 */
const add = async (file, project) => {
  return Caller.call('/api/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ file, project })
  })
}

export default add
