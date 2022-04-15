/** @module Route.Result.Archive */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkSimulationAuth } from '../auth'
import { error } from '../error'

import ResultLib from '@/lib/result'

export interface IArchiveBody {
  simulation: {
    id: string
  }
}

/**
 * Check archive body
 * @param body Body
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
 * @param req Request
 * @param res Response
 */
const archive = async (req: Request, res: Response): Promise<void> => {
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
        const archiveStream = await ResultLib.archive(simulation)
        archiveStream.pipe(res)
      } catch (err: any) {
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err: any) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}

export default archive
