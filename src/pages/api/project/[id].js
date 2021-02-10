import route from '@/route/project/[id]'

/**
 * Project API from [id]
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
