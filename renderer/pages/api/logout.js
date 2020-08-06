import { removeTokenCookie } from '../../../src/auth/auth-cookies'

export default async function (req, res) {
  removeTokenCookie(res)
  res.end()
}
