import { IRequest, IResponse } from '..'
import { session } from '../session'
import { error } from '../error'

import UserLib from '@/lib/user'

export interface ILoginBody {
  email: string
  password: string
}

/**
 * Check login body
 * @memberof Route.User
 * @param body Body
 */
const checkLoginBody = (body: ILoginBody): void => {
  if (
    !body ||
    !body.email ||
    typeof body.email !== 'string' ||
    !body.password ||
    typeof body.password !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { email(string), password(string) })'
    )
}

/**
 * User check API
 * @memberof Route.User
 * @param req Request
 * @param res Response
 */
export default async (
  req: IRequest<ILoginBody>,
  res: IResponse
): Promise<void> => {
  try {
    // Check session
    await session(req)

    if (req.method === 'POST') {
      // Check
      checkLoginBody(req.body)

      // Login
      try {
        const user = await UserLib.login(req.body)
        if (user) {
          res.status(200).json({ valid: true })
        } else {
          res.status(401).json({ valid: false })
        }
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
