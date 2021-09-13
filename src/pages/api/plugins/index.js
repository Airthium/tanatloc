import route from '@/route/plugins'

/**
 * Plugins API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req, res) => {
  await route(req, res)
}

export default api
