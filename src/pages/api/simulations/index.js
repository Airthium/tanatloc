import route from '@/route/simulations'

/**
 * Simulations API from [ids]
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req, res) => {
  await route(req, res)
}

export default api
