/** @module Route.Organization.[id] */

import { Request, Response } from 'express'

import { session } from '../session'
import { error } from '../error'

import OrganizationLib from '@/lib/organization'

/**
 * Organization API by id
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    // Id
    const id = req.query.id || req.params.id // Electron uses params

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(string) })')

    switch (req.method) {
      case 'PUT':
        //Accept
        try {
          await OrganizationLib.accept({ id }, { id: sessionId })
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      case 'POST':
        // Decline
        try {
          await OrganizationLib.decline({ id }, { id: sessionId })
          res.status(200).end()
        } catch (err: any) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Quit
        try {
          await OrganizationLib.quit({ id }, { id: sessionId })
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
