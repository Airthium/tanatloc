/** @module Route.Result */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkSimulationAuth } from '../auth'
import { error } from '../error'

import ResultLib from '@/lib/result'

export interface ILoadBody {
  simulation: {
    id: string
  }
  result: {
    originPath: string
    json: string
    glb: string
  }
}

/**
 * Check load body
 * @param body Body
 */
const checkLoadBody = (body: ILoadBody): void => {
  if (
    !body ||
    !body.simulation ||
    !body.simulation.id ||
    typeof body.simulation.id !== 'string' ||
    !body.result ||
    !body.result.originPath ||
    typeof body.result.originPath !== 'string' ||
    !body.result.glb ||
    typeof body.result.glb !== 'string' ||
    !body.result.json ||
    typeof body.result.json !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), glb(string), json(string) } }'
    )
}

/**
 * Result API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      // Load result
      // Check
      checkLoadBody(req.body)

      const { simulation, result } = req.body

      // Check auth
      await checkSimulationAuth({ id: sessionId }, { id: simulation.id })

      // Load
      try {
        const data = await ResultLib.load(simulation, result)
        res.status(200).json(data)
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

export default route
