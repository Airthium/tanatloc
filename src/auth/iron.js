import Iron from '@hapi/iron'
import { getTokenCookie } from './auth-cookies'

import config from '../../config/auth'

const TOKEN_SECRET = config.secret

export function encryptSession(session) {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

export async function getSession(req) {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}
