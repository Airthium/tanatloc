import route from '../../../../src/route/projects/[ids]'

/**
 * Projects API from [ids]
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  await route(req, res)
}
