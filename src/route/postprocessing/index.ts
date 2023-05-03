/** @module Route.Postprocessing */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkSimulationAuth } from '../auth'
import { error } from '../error'

import PostprocessingLib from '@/lib/postprocessing'

export interface IBody {
  simulation: {
    id: string
  }
  result: {
    fileName: string
    originPath: string
  }
  filter: string
  parameters: string[]
}

/**
 * Check body
 * @param body Body
 */
const checkBody = (body: IBody): void => {
  if (
    !body?.simulation?.id ||
    typeof body.simulation.id !== 'string' ||
    !body.result?.fileName ||
    typeof body.result.fileName !== 'string' ||
    !body.result.originPath ||
    typeof body.result.originPath !== 'string' ||
    !body.filter ||
    typeof body.filter !== 'string' ||
    !body.parameters ||
    !Array.isArray(body.parameters)
  )
    throw error(
      400,
      'Missing data in your request (body: { result: { fileName(string), originPath(string) }, filter: string, parameters: (string[]) }'
    )
}

/**
 * Postprocessing API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      // Check
      checkBody(req.body)

      const { simulation, result, filter, parameters } = req.body

      // Check auth
      await checkSimulationAuth({ id: sessionId }, { id: simulation.id })

      // Load
      try {
        const data = await PostprocessingLib.run(
          simulation,
          result,
          filter,
          parameters
        )

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
