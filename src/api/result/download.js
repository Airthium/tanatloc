import Caller from '@/api/call'

/**
 * Download result
 * @param {Object} simulation  Simulation { id }
 * @param {Object} result Result { originPath, fileName }
 * @returns
 */
const download = async (simulation, result) => {
  return Caller.call('/api/result/download', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}

export default download
