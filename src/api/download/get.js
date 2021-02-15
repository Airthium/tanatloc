import Caller from '@/api/call'

/**
 * Download file
 * @param {Object} file File
 * @param {boolean} archive Archive
 */
const get = async (simulation, file, archive) => {
  return Caller.call('/api/download', {
    method: 'POST',
    body: JSON.stringify({ simulation, file, archive })
  })
}

export default get
