import route from '@/route/logout'

/**
 * Logout API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const logout = async (req, res) => {
  await route(req, res)
}

export default logout
