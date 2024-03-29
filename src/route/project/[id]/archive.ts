/** @module Route.Project.[id].Archive */

import { Request, Response } from 'express'

import { session } from '@/route/session'
import { checkProjectAuth } from '@/route/auth'
import { error } from '@/route/error'

import ProjectLib from '@/lib/project'

/**
 * Project archive API
 * @param req Request
 * @param res Response
 */
const archive = async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id ?? req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    // Check authorization
    await checkProjectAuth({ id: sessionId }, { id })

    switch (req.method) {
      case 'GET': {
        // Archive project
        try {
          res.setHeader('Content-Type', 'application/x-tgz')
          const archiveStream = await ProjectLib.archive({ id })
          archiveStream.pipe(res)
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      }
      case 'POST': {
        try {
          await ProjectLib.unarchiveFromFile({ id }, req.body.archive)
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      }
      case 'PUT': {
        // Unarchive project from server
        try {
          await ProjectLib.unarchiveFromServer({ id })
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      }
      case 'DELETE': {
        // Delete archive file
        try {
          await ProjectLib.deleteArchiveFile({ id })
          res.status(200).end()
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

export default archive
