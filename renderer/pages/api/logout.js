import { removeTokenCookie } from '../../../src/auth/auth-cookies'

/**
 * Logout API
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  removeTokenCookie(res)
  res.end()
}
