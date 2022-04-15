/** @module Route.Logout */

import { Request, Response } from 'express'

import { removeTokenCookie } from '@/auth/auth-cookies'

import Sentry from '@/lib/sentry'

/**
 * Logout API
 * @param _ Request (unused)
 * @param res Response
 */
export const logout = async (_: Request, res: Response): Promise<void> => {
  try {
    removeTokenCookie(res)
    res.status(200).end()
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
  }
}
