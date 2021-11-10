import route from '@/route/project/[id]/archive'

/**
 * Project archive API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const archive = async (req, res) => {
  await route(req, res)
}

export default archive
