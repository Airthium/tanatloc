/** @module Auth.Iron */

import Iron from '@hapi/iron'
import { getTokenCookie } from './auth-cookies'

import { SECRET } from '@/config/auth'

import { IRequest } from '@/route/index.d'

/**
 * Token secret
 * @memberof Auth.Iron
 */
const TOKEN_SECRET: string = SECRET

export type Token = {
  id: string
}

/**
 * Encrypt session
 * @memberof Auth.Iron
 * @param session Session
 * @returns Encrypted token
 */
const encryptSession = (session: Token): Promise<string> => {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

/**
 * Get session
 * @memberof Auth.Iron
 * @param req Request
 * @returns Token
 */
const getSession = async (req: IRequest): Promise<Token> => {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}

export { encryptSession, getSession }
