import Local from 'passport-local'
import { login } from '../database/user'

export const localStrategy = new Local.Strategy(function (
  username,
  password,
  done
) {
  login({ username, password })
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      done(error)
    })
})
