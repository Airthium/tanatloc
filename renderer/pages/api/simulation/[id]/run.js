import route from '../../../../../src/route/simulation/[id]/run'

/**
 * Simulation API from [id]/run
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
