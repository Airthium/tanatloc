/** @module Route.Login */

import express, { Request, Response } from 'express'
import passport from 'passport'
import { localStrategy } from '@/auth/password-local'
import { encryptSession } from '@/auth/iron'
import { setTokenCookie } from '@/auth/auth-cookies'

import Sentry from '@/lib/sentry'

/**
 * Authenticate
 * @param method Method
 * @param req Request
 * @param res Response
 */
const authenticate = async (
  method: string,
  req: Request,
  res: Response
): Promise<{ id: string }> =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      method,
      { session: false },
      (error: Error, token: { id: string }) => {
        if (error) {
          reject(error)
        } else {
          resolve(token)
        }
      }
    )(req, res)
  })

passport.use(localStrategy)

/**
 * Login API
 * @param req Request
 * @param res Response
 */
export const loginRoute = async (req: Request, res: Response) => {
  try {
    const user = await authenticate('local', req, res)
    if (!user) {
      throw new Error('Bad credentials')
    }

    const session = { ...user }
    const token = await encryptSession(session)
    setTokenCookie(res, token)

    res.status(200).json(session)
  } catch (err: any) {
    console.error(err)
    res.status(401).json({ error: true, message: err.message })
    Sentry.configureScope((scope) => {
      scope.setUser({
        email: req.body.email
      })
    })
    Sentry.captureException(err)
    Sentry.configureScope((scope) => {
      scope.setUser(null)
    })
  }
}

const app = express()
app.disable('x-powered-by')
app.use(passport.initialize())
app.post('/api/login', (req, res) => {
  loginRoute(req, res).catch(console.error)
})

export default app
