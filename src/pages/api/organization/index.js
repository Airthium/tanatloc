import route from '@/route/organization'

/**
 * Organization API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req, res) => {
  await route(req, res)
}

export default api
