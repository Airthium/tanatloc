/** @namespace Route.Plugins */

import { IRequest, IResponse } from '..'
import { session } from '../session'
import { error } from '../error'

import UserLib from '@/lib/user'
import PluginsLib from '@/lib/plugins'

/**
 * Plugins API
 * @memberof Route.Plugins
 * @param req Request
 * @param res Response
 */
export default async (req: IRequest, res: IResponse) => {
  try {
    // Check session
    const sessionId = await session(req)

    if (req.method === 'GET') {
      // Get
      try {
        // Get user data
        const user = await UserLib.get(sessionId, ['authorizedplugins'])

        // Get list
        const list = await PluginsLib.clientList(user)
        res.status(200).json(list)
      } catch (err) {
        throw error(500, err.message)
      }
    } else if (req.method === 'POST') {
      // Get complete
      try {
        // Get complete list
        const list = await PluginsLib.clientList(null, true)
        res.status(200).json(list)
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
