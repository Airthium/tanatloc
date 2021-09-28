import Caller from '@/api/call'

/**
 * Download result
 * @memberof module:api/result
 * @param {Object} simulation  Simulation { id }
 * @param {Object} result Result { originPath, fileName }
 */
const download = async (simulation, result) => {
  return Caller.call('/api/result/download', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}

export default download
