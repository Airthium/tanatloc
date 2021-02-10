import route from '@/route/simulation/[id]'

/**
 * Simulation API from [id]
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  await route(req, res)
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '150mb'
    }
  }
}
