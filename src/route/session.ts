/** @module Route.Session */

import { Request } from 'express'

import { getSession } from '@/auth/iron'

import UserLib from '@/lib/user'

import { error } from './error'

/**
 * Session
 * @param req Request
 */
export const session = async (req: Request): Promise<string> => {
  try {
    const s = await getSession(req)
    if (!s?.id) throw error(401, 'Unauthorized', false)

    const user = await UserLib.get(s.id, [])
    if (!user) throw error(401, 'Unauthorized', false)

    return s.id
  } catch (err) {
    throw error(401, 'Unauthorized', false)
  }
}
