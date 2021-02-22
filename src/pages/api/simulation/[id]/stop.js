import route from '@/route/simulation/[id]/stop'

/**
 * Simulation API from [id]/stop
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
