import route from '@/route/geometry/[id]'

/**
 * Geometry API from [id]
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const id = async (req, res) => {
  await route(req, res)
}

export default id
