import route from '@/route/result/archive'

/**
 * Result archive API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const archive = async (req, res) => {
  await route(req, res)
}

export default archive
