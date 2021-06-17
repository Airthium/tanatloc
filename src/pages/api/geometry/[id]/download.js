import route from '@/route/geometry/[id]/download'

/**
 * Geometry API for [id]/download
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const download = async (req, res) => {
  await route(req, res)
}

export default download
