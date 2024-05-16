/** @module Auth.AuthCookies */

import { serialize, parse } from 'cookie'
import { Request, Response } from 'express'
import isElectron from 'is-electron'
import ElectronStore from 'electron-store'

let storage: ElectronStore
if (isElectron()) storage = new ElectronStore()

/**
 * Token name
 */
const TOKEN_NAME: string = 'token'

/**
 * Max age
 */
const MAX_AGE: number = 60 * 60 * 8 // 8 hours

/**
 * Set token cookie
 * @param res Response
 * @param token Token
 */
const setTokenCookie = (res: Response, token: string): void => {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: false,
    path: '/',
    sameSite: 'lax'
  })

  if (isElectron()) storage.set('auth-token', cookie)
  else res.setHeader('Set-Cookie', cookie)
}

/**
 * Remove token cookie
 * @param res Reponse
 */
const removeTokenCookie = (res: Response): void => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/'
  })

  if (isElectron()) storage.delete('auth-token')
  else res.setHeader('Set-Cookie', cookie)
}

/**
 * Parse cookie
 * @param req Request
 * @returns Cookie
 */
const parseCookies = (req: Request): { [key: string]: string } => {
  // For API Routes we don't need to parse the cookies.
  if (isElectron()) {
    const cookie = storage.get('auth-token') as string
    return parse(cookie?.toString() ?? '')
  } else {
    if (req.cookies) return req.cookies

    // For pages we do need to parse the cookies.
    const cookie = req.headers?.cookie
    return parse(cookie ?? '')
  }
}

/**
 * Get token cookie
 * @param req Request
 * @returns Cookie
 */
const getTokenCookie = (req: Request): string => {
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}

export { setTokenCookie, removeTokenCookie, parseCookies, getTokenCookie }
