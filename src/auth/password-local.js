/** @module auth/password-local */

import Local from 'passport-local'
import UserDB from '@/database/user'

export const localStrategy = new Local.Strategy(
  { usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    UserDB.getByUsernameAndPassword({ email, password })
      .then((user) => {
        done(null, user)
      })
      .catch((error) => {
        done(error)
      })
  }
)
