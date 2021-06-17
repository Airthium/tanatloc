import route from '@/route/result/download'

/**
 * Result download API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const download = async (req, res) => {
  await route(req, res)
}

export default download
