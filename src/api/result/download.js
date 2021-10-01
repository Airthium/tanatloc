import Caller from '@/api/call'

/**
 * Download
 * @memberof API.Result
 * @param {Object} simulation  Simulation { id }
 * @param {Object} result Result { originPath, fileName }
 * @returns {Object} Download read stream
 */
const download = async (simulation, result) => {
  return Caller.call('/api/result/download', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}

export default download
