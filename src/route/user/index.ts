/** @module Route.User */

import { Request, Response } from 'express'

import { session } from '../session'
import { error } from '../error'

import { IDataBaseEntry } from '@/database/index.d'

import UserLib from '@/lib/user'

export interface IAddBody {
  email: string
  password: string
}

export type IUpdateBody = IDataBaseEntry[]

/**
 * Check add body
 * @memberof Route.User
 * @param body Body
 */
const checkAddBody = (body: IAddBody): void => {
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
 * Check update body
 * @memberof Route.User
 * @param body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (!body || !Array.isArray(body))
    throw error(400, 'Missing data in your request (body(array))')
}

/**
 * User API
 * @memberof Route.User
 * @param req Request
 * @param res Response
 */
export default async (req: Request, res: Response): Promise<void> => {
  let sessionId

  try {
    switch (req.method) {
      case 'GET':
        // Check session
        sessionId = await session(req)

        // Get
        try {
          const user = await UserLib.getWithData(sessionId, [
            'lastname',
            'firstname',
            'email',
            'avatar',
            'superuser',
            'authorizedplugins',
            'plugins'
          ])
          res.status(200).json({ user })
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'POST':
        // Check
        checkAddBody(req.body)

        try {
          // Add
          const user = await UserLib.add(req.body)
          res.status(200).json(user)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check session
        sessionId = await session(req)

        // Check
        checkUpdateBody(req.body)

        try {
          // Update
          await UserLib.update({ id: sessionId }, req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'DELETE':
        // Check session
        sessionId = await session(req)

        try {
          // Delete
          await UserLib.del({ id: sessionId })
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
