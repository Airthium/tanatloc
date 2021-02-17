import Caller from '@/api/call'

/**
 * Update system item
 * @param {string} item Item
 */
const update = async (data) => {
  return Caller.call('/api/system', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
