/** @module Route.Simulation.[id].Run */

import { Request, Response } from 'express'

import { session } from '@/route/session'
import { checkSimulationAuth } from '@/route/auth'
import { error } from '@/route/error'

import SimulationLib from '@/lib/simulation'

/**
 * Simulation API run
 * @param req Request
 * @param res Response
 */
const run = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id ?? req.params.id // Electron uses params

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkSimulationAuth({ id: sessionId }, { id })

    if (req.method === 'PUT') {
      // Run
      try {
        await SimulationLib.run({ id: sessionId }, { id }, req.body.keepMesh)
        res.status(200).end()
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

export default run
