import express from 'express'
import passport from 'passport'
import { localStrategy } from '../../../src/auth/password-local'
import { encryptSession } from '../../../src/auth/iron'
import { setTokenCookie } from '../../../src/auth/auth-cookies'

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

export const loginRoute = async (req, res) => {
  try {
    const user = await authenticate('local', req, res)
    console.log(user)
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
