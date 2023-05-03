/** @module Route.Link */

import { Request, Response } from 'express'

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
 * @param body Body
 */
const checkGetBody = (body: IGetBody): void => {
  if (
    !body?.id ||
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
 * @param body Body
 */
const checkProcessBody = (body: IProcessBody): void => {
  if (!body?.id || typeof body.id !== 'string')
    throw error(
      400,
      'Missing data in your request (body: { id(uuid), data(?object) })'
    )
}

/**
 * Link API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    switch (req.method) {
      case 'POST':
        // Check
        checkGetBody(req.body)

        // Get
        try {
          const link = await LinkLib.get(req.body.id, req.body.data)
          res.status(200).json(link)
        } catch (err: any) {
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
