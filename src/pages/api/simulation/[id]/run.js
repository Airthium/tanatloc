import route from '@/route/simulation/[id]/run'

/**
 * Simulation API from [id]/run
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
