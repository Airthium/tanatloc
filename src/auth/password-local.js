import Local from 'passport-local'
import { getByUsernameAndPassword } from '../database/user'

export const localStrategy = new Local.Strategy((username, password, done) => {
  getByUsernameAndPassword({ username, password })
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      done(error)
    })
})
