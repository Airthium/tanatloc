import route from '@/route/projects/[ids]'

/**
 * Projects API from [ids]
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}
