/** @module Route.UserModel */

import { Request, Response } from 'express'

import { IDataBaseEntry } from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { session } from '../session'
import { error } from '../error'

import UserModelLib from '@/lib/userModel'

export interface IAddBody {
  userModel: {
    model: IModel
    template: string
  }
}

export interface IUpdateBody {
  userModel: {
    id: string
  }
  data: IDataBaseEntry[]
}

export interface IDeleteBody {
  userModel: {
    id: string
  }
}

/**
 * Check add body
 * @param body Body
 */
const checkAddBody = (body: IAddBody): void => {
  if (
    !body?.userModel?.model ||
    typeof body.userModel.model !== 'object' ||
    !body.userModel.template ||
    typeof body.userModel.template !== 'string'
  )
    throw error(
      400,
      'Missing data in your request (body: { userModel: { model(IModel), template(string) } })'
    )
}

/**
 * Check update body
 * @param body Body
 */
const checkUpdateBody = (body: IUpdateBody): void => {
  if (
    !body?.userModel?.id ||
    typeof body.userModel.id !== 'string' ||
    !body.data ||
    !Array.isArray(body.data)
  )
    throw error(
      400,
      'Missing data in your request (body: { userModel: { id(string) }, data(array) })'
    )
}

/**
 * Check delete body
 * @param body Body
 */
const checkDeleteBody = (body: IDeleteBody): void => {
  if (!body?.userModel?.id || typeof body.userModel.id !== 'string')
    throw error(
      400,
      'Missin data in your request (body: { userModel: { id(string) } })'
    )
}

/**
 * Add
 * @param req Request
 * @param res Response
 * @param sessionId Session id
 */
const add = async (
  req: Request,
  res: Response,
  sessionId: string
): Promise<void> => {
  // Check
  checkAddBody(req.body)

  const { userModel } = req.body

  // Add
  try {
    const newUserModel = await UserModelLib.add(userModel, {
      id: sessionId
    })
    res.status(200).json(newUserModel)
  } catch (err: any) {
    throw error(500, err.message)
  }
}

/**
 * Update
 * @param req Request
 * @param res Response
 */
const update = async (req: Request, res: Response): Promise<void> => {
  // Check
  checkUpdateBody(req.body)

  const { userModel, data } = req.body

  // Update
  try {
    await UserModelLib.update(userModel, data)
    res.status(200).end()
  } catch (err: any) {
    throw error(500, err.message)
  }
}

/**
 * Delete
 * @param req Request
 * @param res Response
 * @param sessionId Session id
 */
const del = async (
  req: Request,
  res: Response,
  sessionId: string
): Promise<void> => {
  // Check
  checkDeleteBody(req.body)

  const { userModel } = req.body

  // Delete
  try {
    await UserModelLib.del({ id: sessionId }, userModel)
    res.status(200).end()
  } catch (err: any) {
    throw error(500, err.message)
  }
}

/**
 * UserModel API
 * @param req Request
 * @param res Response
 */
const route = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check session
    const sessionId = await session(req)

    switch (req.method) {
      case 'POST':
        await add(req, res, sessionId)
        break
      case 'PUT':
        await update(req, res)
        break
      case 'DELETE':
        await del(req, res, sessionId)
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
