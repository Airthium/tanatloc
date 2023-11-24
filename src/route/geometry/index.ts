/** @module Route.Geometry */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkProjectAuth } from '../auth'
import { error } from '../error'

import GeometryLib from '@/lib/geometry'

export interface IAddBody {
  project: {
    id: string
  }
  geometry: {
    name: string
    uid: string
    buffer: Buffer
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
    !body.geometry?.name ||
    typeof body.geometry.name !== 'string' ||
    !body.geometry.uid ||
    typeof body.geometry.uid !== 'string' ||
    !body.geometry.buffer ||
    typeof body.geometry.buffer !== 'object'
  )
    throw error(
      400,
      'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    )
}

/**
 * Geometry API
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

        const { project, geometry } = req.body

        // Check auth
        await checkProjectAuth({ id: sessionId }, project)

        // Add
        try {
          const newGeometry = await GeometryLib.add(project, geometry)
          res.status(200).json(newGeometry)
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
