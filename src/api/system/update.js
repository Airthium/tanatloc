import Caller from '@/api/call'

/**
 * Update system item
 * @memberof module:api/system
 * @param {string} data Data
 */
const update = async (data) => {
  return Caller.call('/api/system', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
