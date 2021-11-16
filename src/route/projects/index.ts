/** @namespace Route.Projects */

import { IRequest, IResponse } from '..'
import { session } from '../session'
import { checkProjectAuth } from '../auth'
import { error } from '../error'

import ProjectLib from '@/lib/project'

interface IGetBody {
  ids: string[]
}

/**
 * Check get body
 * @memberof Route.Projects
 * @param {Object} body Body
 */
const checkGetBody = (body: IGetBody): void => {
  if (!body)
    throw error(400, 'Missing data in your request (body: { ids(?array) })')
}

/**
 * Projects API
 * @memberof Route.Projects
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req: IRequest<IGetBody>, res: IResponse) => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      // Check
      checkGetBody(req.body)

      // Ids
      const ids = req.body.ids

      if (!ids || !Array.isArray(ids)) {
        res.status(200).json({ projects: [] })
        return
      }

      // Get projects
      const projectsTmp = await Promise.all(
        ids.map(async (id) => {
          try {
            await checkProjectAuth({ id: sessionId }, { id })

            // Get
            return await ProjectLib.getWithData(id, [
              'archived',
              'title',
              'description',
              'createddate',
              'lastaccess',
              'avatar',
              'owners',
              'users',
              'groups',
              'simulations',
              'workspace'
            ])
          } catch (err) {
            console.warn(err)
            return null
          }
        })
      )

      try {
        const projects = projectsTmp.filter((p) => p)
        res.status(200).json({ projects })
      } catch (err) {
        /* istanbul ignore next */
        throw error(500, err.message)
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
