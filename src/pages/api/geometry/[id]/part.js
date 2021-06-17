import route from '@/route/geometry/[id]/part'

/**
 * Geometry API for [id]/part
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const part = async (req, res) => {
  await route(req, res)
}

export default part
