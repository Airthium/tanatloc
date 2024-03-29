/** @module Route.Groups.[id] */

import { Request, Response } from 'express'

import { session } from '../session'
import { checkOrganizationAuth } from '../auth'
import { error } from '../error'

import GroupLib from '@/lib/group'

/**
 * Groups API [id]
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id ?? req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    if (req.method === 'GET') {
      // Check auth
      await checkOrganizationAuth({ id: sessionId }, { id })

      try {
        // Get
        const groups = await GroupLib.getByOrganization(id, [
          'name',
          'users',
          'workspaces',
          'projects',
          'usermodels'
        ])
        res.status(200).json({ groups })
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

export default route
