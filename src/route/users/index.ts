/** @module Route.Users */

import { Request, Response } from 'express'

import { session } from '../session'
import { error } from '../error'

import UserLib from '@/lib/user'

/**
 * Users API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    // Check superuser
    const user = await UserLib.get(sessionId, ['superuser'])
    if (!user?.superuser) throw error(403, 'Access denied')

    if (req.method === 'GET') {
      try {
        // Get all
        const users = await UserLib.getAll([
          'id',
          'firstname',
          'lastname',
          'email',
          'authorizedplugins',
          'superuser'
        ])
        res.status(200).json({ users })
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
