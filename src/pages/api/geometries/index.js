import route from '@/route/geometries'

/**
 * Geometries API from [ids]
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req, res) => {
  await route(req, res)
}

export default api
