import route from '@/route/result/archive'

/**
 * Result archive API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const archive = async (req, res) => {
  await route(req, res)
}

export default archive
