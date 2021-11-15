import getSessionId from '../../session'
import { checkProjectAuth } from '../../auth'
import error from '../../error'

import ProjectLib from '@/lib/project'

/**
 * Project archive API
 * @memberof Route.Project
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

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
