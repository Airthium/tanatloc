/** @module Route.Email */

import { Request, Response } from 'express'

import { error } from '../error'

import { PASSWORD_RECOVERY } from '@/config/email'

import EmailLib from '@/lib/email'
import UserLib from '@/lib/user'

export interface ICheckBody {
  email: string
  type: string
}

/**
 * Check send body
 * @param body Body
 */
const checkSendBody = (body: ICheckBody): void => {
  if (
    !body?.type ||
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
 * @param req Request
 * @param res Result
 */
const route = async (req: Request, res: Response): Promise<void> => {
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
        } catch (err: any) {
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
  } catch (err: any) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}

export default route
