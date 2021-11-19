import { IRequest, IResponse } from '..'
import { session } from '../session'
import { error } from '../error'

import { IDataBaseEntry } from '@/database/index.d'

import UserLib from '@/lib/user'

export type IUpdateBody = IDataBaseEntry[]

/**
 * Check update body
 * @memberof Route.User
 * @param body Body
 */
const checkUpdateBody = (body) => {
  if (!body || !Array.isArray(body))
    throw error(400, 'Missing data in your request (body(array))')
}

/**
 * User API by [id]
 * @memberof Route.User
 * @param req Request
 * @param res Response
 */
export default async (
  req: IRequest<IUpdateBody>,
  res: IResponse
): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    // Check superuser
    const superuser = await UserLib.get(sessionId, ['superuser'])
    if (!superuser.superuser) throw error(403, 'Access denied')

    // Id
    const id = req.query.id || req.params.id // Electron

    // Check
    if (!id || typeof id !== 'string')
      throw error(400, 'Missing data in your request (query: { id(uuid) })')

    switch (req.method) {
      case 'GET':
        try {
          const user = await UserLib.getWithData(id, [
            'lastname',
            'firstname',
            'email',
            'avatar',
            'plugins',
            'superuser',
            'authorizedplugins'
          ])
          res.status(200).json({ user })
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkUpdateBody(req.body)

        try {
          // Update
          await UserLib.update({ id }, req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        try {
          await UserLib.del({ id })
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
