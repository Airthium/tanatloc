/** @module api */

import express from 'express'
import passport from 'passport'
import { localStrategy } from '../auth/password-local'
import { encryptSession } from '../auth/iron'
import { setTokenCookie } from '../auth/auth-cookies'

const app = express()
const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })(req, res)
  })

app.disable('x-powered-by')

app.use(passport.initialize())

passport.use(localStrategy)

/**
 * Login API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const loginRoute = async (req, res) => {
  try {
    const user = await authenticate('local', req, res)
    if (!user) {
      throw new Error('Bad credentials')
    }

    const session = { ...user }
    const token = await encryptSession(session)
    setTokenCookie(res, token)

    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(401).send(error.message)
  }
}

app.post('/api/login', loginRoute)

export default app
