/** @module Route.Link */

import { IRequest, IResponse } from '..'
import { error } from '../error'

import LinkLib from '@/lib/link'

export interface IGetBody {
  id: string
  data: string[]
}

export interface IProcessBody {
  id: string
  data?: {
    email: string
    password: string
  }
}

/**
 * Check get body
 * @memberof Route.Link
 * @param body Body
 */
const checkGetBody = (body: IGetBody): void => {
  if (
    !body ||
    !body.id ||
    typeof body.id !== 'string' ||
    !body.data ||
    !Array.isArray(body.data)
  )
    throw error(
      400,
      'Missing data in your request (body: { id(uuid), data(array) })'
    )
}

/**
 * Check process body
 * @memberof Route.Link
 * @param body Body
 */
const checkProcessBody = (body: IProcessBody): void => {
  if (!body || !body.id || typeof body.id !== 'string')
    throw error(
      400,
      'Missing data in your request (body: { id(uuid), data(?object) })'
    )
}

/**
 * Link API
 * @memberof Route.Link
 * @param req Request
 * @param res Response
 */
export default async (
  req: IRequest<IGetBody & IProcessBody>,
  res: IResponse
): Promise<void> => {
  try {
    switch (req.method) {
      case 'POST':
        // Check
        checkGetBody(req.body)

        // Get
        try {
          const link = await LinkLib.get(req.body.id, req.body.data)
          res.status(200).json(link)
        } catch (err) {
          throw error(500, err.message)
        }
        break
      case 'PUT':
        // Check
        checkProcessBody(req.body)

        // Process
        try {
          await LinkLib.process(req.body.id, req.body.data)
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
