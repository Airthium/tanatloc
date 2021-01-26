/** @module src/auth/auth-cookies */

import { serialize, parse } from 'cookie'

import isElectron from 'is-electron'
import ElectronStore from 'electron-store'

let storage
if (isElectron()) storage = new ElectronStore()

const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 8 // 8 hours

/**
 * Set token cookie
 * @param {Object} res Response
 * @param {string} token Token
 */
export function setTokenCookie(res, token) {
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
 * @param {Object} res Reponse
 */
export function removeTokenCookie(res) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/'
  })

  if (isElectron()) storage.delete('auth-token')
  else res.setHeader('Set-Cookie', cookie)
}

/**
 * Parse cookie
 * @param {Object} req Response
 */
export function parseCookies(req) {
  // For API Routes we don't need to parse the cookies.
  if (isElectron()) {
    const cookie = storage.get('auth-token')
    return parse(cookie || '')
  } else {
    if (req.cookies) return req.cookies

    // For pages we do need to parse the cookies.
    const cookie = req.headers && req.headers.cookie
    return parse(cookie || '')
  }
}

export function getTokenCookie(req) {
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}
