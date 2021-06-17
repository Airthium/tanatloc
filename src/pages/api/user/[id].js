import route from '@/route/user/[id]'

/**
 * user API from [id]
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const _id = async (req, res) => {
  await route(req, res)
}

export default _id
