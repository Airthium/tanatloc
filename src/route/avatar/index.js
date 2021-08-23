/** @module route/avatar */

import getSessionId from '../session'
import { checkProjectAuth } from '../auth'
import error from '../error'

import AvatarLib from '@/lib/avatar'

/**
 * Check add body
 * @param {Object} body Body
 */
const checkAddBody = (body) => {
  if (
    !body ||
    !body.file ||
    !body.file.name ||
    typeof body.file.name !== 'string' ||
    !body.file.uid ||
    typeof body.file.uid !== 'string' ||
    !body.file.data ||
    typeof body.file.data !== 'string' ||
    (body.project && (!body.project.id || typeof body.project.id !== 'string'))
  )
    throw error(
      400,
      'Missing data in your request (body: { file: { name(string), uid(uuid), data(string) }, ?project: { id(uuid) } })'
    )
}

/**
 * Avatar API
 * @param {Object} req Request
 * @param {Object} res Result
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    if (req.method === 'POST') {
      // Check
      checkAddBody(req.body)

      const { file, project } = req.body

      // Check auth
      if (project) await checkProjectAuth({ id: sessionId }, project)

      // Add
      try {
        const avatar = await AvatarLib.add(
          project || { id: sessionId },
          project ? 'project' : 'user',
          file
        )
        res.status(200).json(avatar)
      } catch (err) {
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true })
  }
}
