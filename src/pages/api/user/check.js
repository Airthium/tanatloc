import route from '@/route/user/check'

/**
 * User check API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const check = async (req, res) => {
  await route(req, res)
}

export default check
