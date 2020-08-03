import passport from 'passport'
import LocalStrategy from 'passport-local'
// import { findUserByUsername } from './db'

import login from '../database/query/user/login'
import getByUsername from '../database/query/user/getByUsername'

passport.serializeUser(function (user, done) {
  // serialize the username into session
  done(null, user.username)
})

passport.deserializeUser(function (req, id, done) {
  // deserialize the username back into user object
  getByUsername(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      // Login
      login({ username, password }).then((user) => {
        if (!user) {
          done(null, null)
        } else {
          done(null, user)
        }
      })
    }
  )
)

export default passport
