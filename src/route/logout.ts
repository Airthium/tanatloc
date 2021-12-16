import { Request, Response } from 'express'

import { removeTokenCookie } from '@/auth/auth-cookies'

import Sentry from '@/lib/sentry'

/**
 * Logout API
 * @memberof Route
 * @param req Request
 * @param res Response
 */
export const logout = async (_: Request, res: Response): Promise<void> => {
  try {
    removeTokenCookie(res)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
  }
}
