import passport from 'passport'
import LocalStrategy from 'passport-local'
// import { findUserByUsername } from './db'

import login from '../database/query/user/login'
import getByEmail from '../database/query/user/getByEmail'

passport.serializeUser(function (user, done) {
  // serialize the username into session
  done(null, user.username)
})

passport.deserializeUser(function (req, id, done) {
  // deserialize the username back into user object
  const user = getByEmail({ id })
  console.log(user)
  done(null, user)
})

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      // Here you lookup the user in your DB and compare the password/hashed password
      // const user = findUserByUsername(req, username)
      login({ username, password }).then((user) => {
        console.log(user)
        // Security-wise, if you hashed the password earlier, you must verify it
        // if (!user || await argon2.verify(user.password, password))
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
