import { removeTokenCookie } from '../../../src/auth/auth-cookies'

export default async function logout(req, res) {
  removeTokenCookie(res)
  res.end()
}
