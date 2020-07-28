import isElectron from 'is-electron'
import user from '../../user'

import call from '../call'

export default async ({ username, password }) => {
  if (isElectron()) {
    return await user.login(username, password)
  } else {
    return await call('api/user/login', {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password })
    })
  }
}
