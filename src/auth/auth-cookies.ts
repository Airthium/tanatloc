/** @namespace Auth.AuthCookies */

import { serialize, parse } from 'cookie'

import isElectron from 'is-electron'
import ElectronStore from 'electron-store'

import { IRequest, IResponse } from '@/route'

let storage: ElectronStore
if (isElectron()) storage = new ElectronStore()

/**
 * Token name
 * @memberof Auth.AuthCookies
 */
const TOKEN_NAME: string = 'token'

/**
 * Max age
 * @memberof Auth.AuthCookies
 */
const MAX_AGE: number = 60 * 60 * 8 // 8 hours

/**
 * Set token cookie
 * @memberof Auth.AuthCookies
 * @param {Object} res IResponse
 * @param {string} token Token
 */
const setTokenCookie = (res: IResponse, token: string): void => {
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
 * @memberof Auth.AuthCookies
 * @param {Object} res Reponse
 */
const removeTokenCookie = (res: IResponse): void => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/'
  })

  if (isElectron()) storage.delete('auth-token')
  else res.setHeader('Set-Cookie', cookie)
}

/**
 * Parse cookie
 * @memberof Auth.AuthCookies
 * @param {Object} req IRequest
 * @returns {string} Cookie
 */
const parseCookies = (req: IRequest): string => {
  // For API Routes we don't need to parse the cookies.
  if (isElectron()) {
    const cookie = storage.get('auth-token')
    return parse(cookie || '')
  } else {
    if (req.cookies) return req.cookies

    // For pages we do need to parse the cookies.
    const cookie = req.headers?.cookie
    return parse(cookie || '')
  }
}

/**
 * Get token cookie
 * @memberof Auth.AuthCookies
 * @param {Object} req IRequest
 * @returns {string} Cookie
 */
const getTokenCookie = (req: IRequest): string => {
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}

export { setTokenCookie, removeTokenCookie, parseCookies, getTokenCookie }
