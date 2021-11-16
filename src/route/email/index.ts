/** @namespace Route.Email */

import { IRequest, IResponse } from '..'
import { error } from '../error'

import { PASSWORD_RECOVERY } from '@/config/email'

import EmailLib from '@/lib/email'
import UserLib from '@/lib/user'

interface ICheckBody {
  email: string
  type: string
}

/**
 * Check send body
 * @memberof Route.Email
 * @param {Object} body Body
 */
const checkSendBody = (body: ICheckBody): void => {
  if (
    !body ||
    !body.type ||
    typeof body.type !== 'string' ||
    !body.email ||
    typeof body.email !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { email(string), type(string) }'
    )
}

/**
 * Email API
 * @memberof Route.Email
 * @param {Object} req Request
 * @param {Object} res Result
 */
export default async (
  req: IRequest<ICheckBody>,
  res: IResponse
): Promise<void> => {
  try {
    if (req.method === 'PUT') {
      // Check
      checkSendBody(req.body)

      const { email, type } = req.body

      if (type === PASSWORD_RECOVERY) {
        try {
          // Check if user exists
          const existingUser = await UserLib.getBy(email, [], 'email')

          // Recover
          if (existingUser) await EmailLib.recover(email)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
      } else {
        // Wrong type
        throw error(400, 'Type ' + type + ' not allowed')
      }
    } else {
      // Unauthorized method
      throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
