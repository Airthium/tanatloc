import route from '@/route/simulation/[id]/log'

/**
 * Simulation API from [id]/log
 * @memberof Pages.API
 * @param {Object} req Request
 * @param {Object} res Response
 */
const log = async (req, res) => {
  await route(req, res)
}

export default log
