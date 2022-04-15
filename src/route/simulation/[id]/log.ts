/** @module Route.Simulation.[id].Log */

import { Request, Response } from 'express'

import { session } from '@/route/session'
import { checkSimulationAuth } from '@/route/auth'
import { error } from '@/route/error'

import SimulationLib from '@/lib/simulation'

export interface ILogBody {
  file: string
}

/**
 * Check log body
 * @param body Body
 */
const checkLogBody = (body: ILogBody): void => {
  if (!body || !body.file || typeof body.file !== 'string')
    throw error(400, 'Missing data in your request (body: { file(string) })')
}

/**
 * Simulation API log
 * @param req Request
 * @param res Response
 */
const log = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id || req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkSimulationAuth({ id: sessionId }, { id })

    if (req.method === 'POST') {
      // Check
      checkLogBody(req.body)

      // Log
      try {
        const logContent = await SimulationLib.getLog({ id }, req.body.file)
        res.status(200).json({ log: logContent })
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

export default log
