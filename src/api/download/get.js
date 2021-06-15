import Caller from '@/api/call'

/**
 * Download
 * @memberof module:api/download
 * @param {Object} file File
 * @param {boolean} archive Archive
 */
const get = async (simulation, file, archive) => {
  console.warn('DEPRECATED CALL download/get')
  return Caller.call('/api/download', {
    method: 'POST',
    body: JSON.stringify({ simulation, file, archive })
  })
}

export default get
