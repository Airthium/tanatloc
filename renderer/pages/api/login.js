import login from '../../../src/lib/login'

export default async ({ body: { username, password } }, res) => {
  const auth = await login({ username, password })

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.send(auth)
}
