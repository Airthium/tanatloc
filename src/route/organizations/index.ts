/** @module Route.Organizations */

import { Request, Response } from 'express'

import { session } from '../session'
import { error } from '../error'

import OrganizationLib from '@/lib/organization'

/**
 * Organizations API
 * @memberof Route.Organizations
 * @param req Request
 * @param res Response
 */
export default async (req: Request, res: Response) => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'GET') {
      try {
        const organizations = await OrganizationLib.getByUser(
          { id: sessionId },
          ['id', 'name', 'owners', 'users', 'groups']
        )
        res.status(200).json({ organizations })
      } catch (err) {
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
