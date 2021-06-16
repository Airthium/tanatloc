import route from '@/route/geometry'

/**
 * Geometry API
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const api = async (req, res) => {
  await route(req, res)
}

export default api
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '150mb'
    }
  }
}
