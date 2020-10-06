import route from '../../../../src/route/simulations/[ids]'

/**
 * Simulations API from [ids]
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
