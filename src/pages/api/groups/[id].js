import route from '@/route/groups/[id]'

/**
 * Groups API from [id]
 * @memberof module:pages/api
 * @param {Object} req Request
 * @param {Object} res Response
 */
const id = async (req, res) => {
  await route(req, res)
}

export default id
