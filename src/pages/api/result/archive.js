import route from '@/route/result/archive'

/**
 * Result archive API
 * @memberof module:pages/api
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
