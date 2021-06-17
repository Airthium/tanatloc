import route from '@/route/project/[id]'

/**
 * Project API from [id]
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const _id = async (req, res) => {
  await route(req, res)
}

export default _id
