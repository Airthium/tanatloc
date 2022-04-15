/** @module Route.Simulation.[id] */

import { Request, Response } from 'express'

import { IDataBaseEntry } from '@/database/index.d'

import { session } from '../session'
import { checkSimulationAuth } from '../auth'
import { error } from '../error'

import SimulationLib from '@/lib/simulation'

export type IUpdateBody = IDataBaseEntry[]

/**
 * Check update body
 * @param body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (!body || !Array.isArray(body))
    throw error(400, 'Missing data in your request (body(array))')
}

/**
 * Simulation API by [id]
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
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

    switch (req.method) {
      case 'GET':
        // Get
        try {
          const simulation = await SimulationLib.get(id, [
            'name',
            'scheme',
            'tasks'
          ])
          res.status(200).json({ simulation })
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        try {
          // Update
          await SimulationLib.update({ id }, req.body)
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Delete
        try {
          await SimulationLib.del({ id })
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err: any) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}

export default route
