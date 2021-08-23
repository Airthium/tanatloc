/** @module route/geometry */

import getSessionId from '../session'
import { checkProjectAuth } from '../auth'
import error from '../error'

import GeometryLib from '@/lib/geometry'

/**
 * Check add body
 * @param {Object} body Body
 */
const checkAddBody = (body) => {
  if (
    !body ||
    !body.project ||
    !body.project.id ||
    typeof body.project.id !== 'string' ||
    !body.geometry ||
    !body.geometry.name ||
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
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    // Check session
    const sessionId = await getSessionId(req, res)

    switch (req.method) {
      case 'GET':
        // Emty route
        res.status(200).end()
        break
      case 'POST':
        // Check
        checkAddBody(req.body)

        const { project, geometry } = req.body

        // Check auth
        await checkProjectAuth({ id: sessionId }, project)

        // Add
        try {
          const newGeometry = await GeometryLib.add(project, geometry)
          res.status(200).json(newGeometry)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true })
  }
}
