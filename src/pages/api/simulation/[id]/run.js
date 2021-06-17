import route from '@/route/simulation/[id]/run'

/**
 * Simulation API from [id]/run
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const run = async (req, res) => {
  await route(req, res)
}

export default run
