import { WriteStream } from 'fs'
import { Request, Response } from 'express'

import { session } from '@/route/session'
import { checkProjectAuth } from '@/route/auth'
import { error } from '@/route/error'

import ProjectLib from '@/lib/project'

/**
 * Project archive API
 * @memberof Route.Project
 * @param req Request
 * @param res Response
 */
export default async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id || req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkProjectAuth({ id: sessionId }, { id })

    if (req.method === 'GET')
      // Archive project
      try {
        res.setHeader('Content-Type', 'application/x-tgz')
        const archive = await ProjectLib.archive({ id })
        archive.pipe(res)
      } catch (err) {
        throw error(500, err.message)
      }
    else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
