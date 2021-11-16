import { IRequest, IResponse } from '..'
import { session } from '../session'
import { checkProjectAuth } from '../auth'
import { error } from '../error'

import { IDataBaseEntry } from '@/database/index.d'

import ProjectLib from '@/lib/project'

type IUpdateBody = IDataBaseEntry[]

interface IDeleteBody {
  id: string
}

/**
 * Check update body
 * @memberof Route.Project
 * @param {Array} body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (!body || !Array.isArray(body))
    throw error(400, 'Missing data in your request (body(array))')
}

/**
 * Check delete body
 * @memberof Route.Project
 * @param {Object} body Body
 */
const checkDeleteBody = (body: IDeleteBody): void => {
  if (!body || !body.id || typeof body.id !== 'string')
    throw error(400, 'Missing data in your request (body: { id(uuid) })')
}

/**
 * Project API by [id]
 * @memberof Route.Project
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (
  req: IRequest<IUpdateBody & IDeleteBody>,
  res: IResponse
): Promise<void> => {
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

    switch (req.method) {
      case 'GET':
        // Get project
        try {
          const project = await ProjectLib.getWithData(id, [
            'title',
            'description',
            'avatar',
            'owners',
            'users',
            'geometries',
            'simulations'
          ])

          res.status(200).json({ project })
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        // Update
        try {
          await ProjectLib.update({ id }, req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Check
        checkDeleteBody(req.body)

        // Delete
        try {
          await ProjectLib.del(req.body, { id })
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
