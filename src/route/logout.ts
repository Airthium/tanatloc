import { removeTokenCookie } from '@/auth/auth-cookies'

import Sentry from '@/lib/sentry'

import { IRequest, IResponse } from '.'

/**
 * Logout API
 * @memberof Route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const logout = async (_: IRequest, res: IResponse): Promise<void> => {
  try {
    removeTokenCookie(res)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: true, message: err.message })
    Sentry.captureException(err)
  }
}
