import call from '../call'

// import { login } from '../../user'

export default async ({ username, password }) => {
  return await call('api/user/login', {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password })
  })
}
