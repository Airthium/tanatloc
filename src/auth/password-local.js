/** @namespace Auth.PasswordLocal */

import Local from 'passport-local'
import UserDB from '@/database/user'

/**
 * @memberof Auth.PasswordLocal
 */
const localStrategy = new Local.Strategy(
  { usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    UserDB.getByUsernameAndPassword({ email, password })
      .then((user) => {
        if (!user) done(new Error('Bad credentials!'))
        else if (!user.isvalidated)
          done(new Error('User email is not validated yet!'))
        done(null, user)
      })
      .catch((error) => {
        done(error)
      })
  }
)

export { localStrategy }
