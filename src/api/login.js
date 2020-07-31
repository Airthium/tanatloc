import call from './call'

export default async ({ username, password }) => {
  return await call('api/login', {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password })
  })
}
