/** @module Route.System */

import { Request, Response } from 'express'

import { IDataBaseEntry } from '@/database/index.d'

import { session } from '../session'
import { error } from '../error'

import UserLib from '@/lib/user'
import SystemLib from '@/lib/system'

export type IUpdateBody = IDataBaseEntry[]

/**
 * Check update body
 * @param body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (!body || !Array.isArray(body))
    throw error(400, 'Missing data in your request (body(array))')
}

/**
 * System API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    switch (req.method) {
      case 'GET':
        try {
          // Get
          const items = await SystemLib.get([
            'allowsignup',
            'password',
            'defaultplugins'
          ])
          res.status(200).json({ system: items })
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check session
        const sessionId = await session(req)

        // Check superuser
        const superuser = await UserLib.get(sessionId, ['superuser'])
        if (!superuser?.superuser) throw error(403, 'Access denied')

        // Check
        checkUpdateBody(req.body)

        // Update
        try {
          await SystemLib.update(req.body)
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err: any) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}

export default route
