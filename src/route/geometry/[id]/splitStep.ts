/** @module Route.Geometry.[id].SplitStep */

import { Request, Response } from 'express'

import { session } from '@/route/session'
import { checkGeometryAuth } from '@/route/auth'
import { error } from '@/route/error'

import GeometryLib from '@/lib/geometry'

/**
 * Geometry API split step
 * @param req Request
 * @param res Response
 */
const part = async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id ?? req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkGeometryAuth({ id: sessionId }, { id })

    if (req.method === 'POST') {
      try {
        // Split step
        const message = await GeometryLib.splitStep(req.body.project, { id })
        res.status(200).json({ message })
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

export default part
