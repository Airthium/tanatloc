/** @namespace Auth.Iron */

import Iron from '@hapi/iron'
import { getTokenCookie } from './auth-cookies'

import config from '@/config/auth'

/**
 * Token secret
 * @memberof Auth.Iron
 */
const TOKEN_SECRET = config.SECRET

/**
 * Encrypt session
 * @memberof Auth.Iron
 * @param {Object} session Session
 * @returns {string} Encrypted token
 */
const encryptSession = (session) => {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

/**
 * Get session
 * @memberof Auth.Iron
 * @param {Object} req Request
 * @returns {string}Token
 */
const getSession = async (req) => {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}

export { encryptSession, getSession }
