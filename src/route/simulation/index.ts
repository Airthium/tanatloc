/** @module Route.Simulation */

import { Request, Response } from 'express'

import { IModel } from '@/models/index.d'

import { session } from '../session'
import { checkProjectAuth } from '../auth'
import { error } from '../error'

import SimulationLib from '@/lib/simulation'

export interface IAddBody {
  project: {
    id: string
  }
  simulation: {
    name: string
    scheme: IModel
  }
}

/**
 * Check add body
 * @param body Body
 */
const checkAddBody = (body: IAddBody): void => {
  if (
    !body?.project?.id ||
    typeof body.project.id !== 'string' ||
    !body.simulation?.name ||
    typeof body.simulation.name !== 'string' ||
    !body.simulation.scheme ||
    typeof body.simulation.scheme !== 'object'
  )
    throw error(
      400,
      'Missing data in your request (body: { project: { id(uuid) }, simulation: { name(string), scheme(object) } }'
    )
}

/**
 * Simulation API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    switch (req.method) {
      case 'GET': {
        // Emty route
        res.status(200).end()
        break
      }
      case 'POST': {
        // Check
        checkAddBody(req.body)

        const { project, simulation } = req.body

        // Check auth
        await checkProjectAuth({ id: sessionId }, { id: project.id })

        // Add
        try {
          const newSimulation = await SimulationLib.add(project, simulation)
          res.status(200).json(newSimulation)
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      }
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err: any) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}

export default route
