import route from '@/route/result/download'

/**
 * Result download API
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const download = async (req, res) => {
  await route(req, res)
}

export default download
