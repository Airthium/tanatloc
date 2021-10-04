import route from '@/route/simulation/[id]/stop'

/**
 * Simulation API from [id]/stop
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const stop = async (req, res) => {
  await route(req, res)
}

export default stop
