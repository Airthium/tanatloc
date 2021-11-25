/** @module Route.Plugin */

import { IRequest, IResponse } from '..'
import { session } from '../session'
import { error } from '../error'

import { IClientPlugin } from '@/database/index.d'

import UserLib from '@/lib/user'
import PluginLib from '@/lib/plugin'

export type IAddBody = IClientPlugin

export type IUpdateBody = object

export interface IDeleteBody {
  uuid: string
}

/**
 * Check add body
 * @memberof Route.Plugin
 * @param body Body
 */
const checkAddBody = (body: IAddBody): void => {
  if (
    !body ||
    !body.key ||
    typeof body.key !== 'string' ||
    !body.configuration ||
    typeof body.configuration !== 'object'
  )
    throw error(
      400,
      'Missing data in your request (body: { key(string), needInit(?bool), configuration(object) }'
    )
}

/**
 * Check update body
 * @memberof Route.Plugin
 * @param body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (!body || typeof body !== 'object')
    throw error(400, 'Missing data in your request (body(object)}')
}

/**
 * Check delete body
 * @memberof Route.Plugin
 * @param body Body
 */
const checkDeleteBody = (body: IDeleteBody): void => {
  if (!body || !body.uuid || typeof body.uuid !== 'string')
    throw error(400, 'Missing data in your request (body: { uuid(uuid) } }')
}

/**
 * Plugin API
 * @memberof Route.Plugin
 * @param req Request
 * @param res Response
 */
export default async (
  req: IRequest<IAddBody & IUpdateBody & IDeleteBody>,
  res: IResponse
): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    switch (req.method) {
      case 'POST':
        // Check
        checkAddBody(req.body)

        const body = req.body

        // Check authorization
        const user = await UserLib.get(sessionId, ['authorizedplugins'])
        if (!user.authorizedplugins?.includes(body.key))
          throw error(403, 'Access denied')

        try {
          await PluginLib.add({ id: sessionId }, body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'GET':
        try {
          const plugins = await PluginLib.getByUser({ id: sessionId })
          res.status(200).json({ plugins })
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        try {
          // Update
          await PluginLib.update({ id: sessionId }, req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Check
        checkDeleteBody(req.body)

        try {
          await PluginLib.del({ id: sessionId }, req.body)
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
