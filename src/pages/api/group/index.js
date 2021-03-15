import route from '@/route/group'

/**
 * Group API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
