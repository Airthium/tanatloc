/** @module Route.Geometries */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkProjectAuth } from '../auth'
import { error } from '../error'

import GeometryLib from '@/lib/geometry'

export interface IGetBody {
  ids: string[]
}

/**
 * Check get body
 * @param body Body
 */
const checkGetBody = (body: IGetBody): void => {
  if (!body)
    throw error(400, 'Missing data in your request (body: { ids(?array) })')
}

/**
 * Geometries API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      // Check
      checkGetBody(req.body)

      // Ids
      const ids = req.body.ids

      if (!Array.isArray(ids)) {
        res.status(200).json({ geometries: [] })
        return
      }

      // Get geometries
      const geometries = []
      for (const id of ids) {
        try {
          // Get geometry
          const geometry = await GeometryLib.get(id, [
            'name',
            'summary',
            'originalfilename',
            'project'
          ])
          if (!geometry) throw error(400, 'Invalid geometry identifier')

          // Check authorization
          await checkProjectAuth({ id: sessionId }, { id: geometry.project })

          geometries.push(geometry)
        } catch (err) {
          console.warn(err)
        }
      }

      try {
        res.status(200).json({ geometries })
      } catch (err: any) {
        /* istanbul ignore next */
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
