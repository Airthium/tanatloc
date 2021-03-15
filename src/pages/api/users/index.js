import route from '@/route/users'

/**
 * Users API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
