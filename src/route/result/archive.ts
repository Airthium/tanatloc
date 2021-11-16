import { IRequest, IResponse } from '..'
import { session } from '../session'
import { checkSimulationAuth } from '../auth'
import { error } from '../error'

import ResultLib from '@/lib/result'

interface IArchiveBody {
  simulation: {
    id: string
  }
}

/**
 * Check archive body
 * @memberof Route.Result
 * @param {Object} body Body
 */
const checkArchiveBody = (body: IArchiveBody): void => {
  if (
    !body ||
    !body.simulation ||
    !body.simulation.id ||
    typeof body.simulation.id !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { simulation: { id(uuid) } }'
    )
}

/**
 * Result archive API
 * @memberof Route.Result
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (
  req: IRequest<IArchiveBody>,
  res: IResponse
): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      // Check
      checkArchiveBody(req.body)

      const { simulation } = req.body

      // Check auth
      await checkSimulationAuth({ id: sessionId }, { id: simulation.id })

      try {
        // Archive
        res.setHeader('Content-Type', 'application/zip')
        const archive = await ResultLib.archive(simulation)
        archive.pipe(res)
      } catch (err) {
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
