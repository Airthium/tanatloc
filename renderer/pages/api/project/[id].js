import route from '../../../../src/route/project/[id]'

/**
 * Project API from [id]
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  await route(req, res)
}
