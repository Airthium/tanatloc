/** @module auth/iron */

import Iron from '@hapi/iron'
import { getTokenCookie } from './auth-cookies'

import config from '@/config/auth'

const TOKEN_SECRET = config.SECRET

/**
 * Encrypt session
 * @param {Object} session Session
 */
export const encryptSession = (session) => {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

/**
 * Get session
 * @param {Object} req Request
 */
export const getSession = async (req) => {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}
