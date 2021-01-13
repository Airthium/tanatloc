import route from '../../../../src/route/plugin'

/**
 * Plugin API
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
