import call from './call'

export default async ({ username, password }) => {
  const res = await call('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password })
  })

  if (res.status === 200) {
    const user = await res.json()
    return user
  } else {
    return null
  }
}
