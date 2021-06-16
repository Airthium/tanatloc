import route from '@/route/simulation/[id]/run'

/**
 * Simulation API from [id]/run
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req, res) => {
  await route(req, res)
}

export default api
