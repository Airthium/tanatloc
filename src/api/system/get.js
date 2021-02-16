import Caller from '@/api/call'

/**
 * Get system item
 * @param {Array} items Items
 */
const get = async (items) => {
  return Caller.call('/api/system', {
    method: 'POST',
    body: JSON.stringify(items)
  })
}

export default get
