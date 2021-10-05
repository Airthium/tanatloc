import Caller from '@/api/call'

/**
 * Archive
 * @memberof API.Result
 * @param {Object} simulation  Simulation `{ id }`
 * @returns {Object} Archive read stream
 */
const archive = async (simulation) => {
  return Caller.call('/api/result/archive', {
    method: 'POST',
    body: JSON.stringify({ simulation })
  })
}

export default archive
