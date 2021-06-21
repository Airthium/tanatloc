import Caller from '@/api/call'

/**
 * Archive result
 * @param {Object} simulation  Simulation { id }
 */
const archive = async (simulation) => {
  return Caller.call('/api/result/archive', {
    method: 'POST',
    body: JSON.stringify({ simulation })
  })
}

export default archive
