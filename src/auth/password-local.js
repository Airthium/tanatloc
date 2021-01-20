/** @module src/auth/password-local */

import Local from 'passport-local'
import UserDB from '@/database/user'

export const localStrategy = new Local.Strategy((username, password, done) => {
  UserDB.getByUsernameAndPassword({ username, password })
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      done(error)
    })
})
