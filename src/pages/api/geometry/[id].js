import route from '@/route/geometry/[id]'

/**
 * Geometry API from [id]
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const _id_ = async (req, res) => {
  await route(req, res)
}

export default _id_
