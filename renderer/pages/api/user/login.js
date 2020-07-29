import user from '../../../../src/lib/user'

export default async ({ body: { username, password } }, res) => {
  const auth = await user.login({ username, password })

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.send(auth)
}
