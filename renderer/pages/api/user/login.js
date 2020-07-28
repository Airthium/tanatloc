import user from '../../../../src/lib/user'

export default async (req, res) => {
  const body = JSON.parse(req.body)
  const username = body.username
  const password = body.password
  const auth = await user.login({ username, password })

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(auth))
}
