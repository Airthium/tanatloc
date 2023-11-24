/** @module Route.Projects */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkProjectAuth } from '../auth'
import { error } from '../error'

import ProjectLib from '@/lib/project'

export interface IPostBody {
  ids: string[]
}

/**
 * Check POST body
 * @param body Body
 */
const checkPostBody = (body: IPostBody): void => {
  if (!body)
    throw error(400, 'Missing data in your request (body: { ids(?array) })')
}

/**
 * Projects API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'POST') {
      // Check
      checkPostBody(req.body)

      // Ids
      const { ids } = req.body

      if (!ids || !Array.isArray(ids)) {
        res.status(200).json({ projects: [] })
        return
      }

      // Get projects
      const projects = []
      for (const id of ids) {
        try {
          await checkProjectAuth({ id: sessionId }, { id })

          // Get
          const project = await ProjectLib.getWithData(id, [
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
          console.log(project)
          if (!project) throw error(400, 'Invalid geometry identifier')

          projects.push(project)
        } catch (err) {
          console.warn(err)
        }
      }

      try {
        res.status(200).json({ projects })
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
