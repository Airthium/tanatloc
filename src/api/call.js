/** @module src/api */

import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

/**
 * Fetcher (for SWR)
 * @param {string} url URL
 */
const fetcher = (url) => fetch(base + url).then((r) => r.json())

/**
 * API call
 * @param {string} route Route
 * @param {Object} param Parameters
 * @returns {Object} Response
 */
const call = async (route, param) => {
  const response = await fetch(base + route, {
    method: (param && param.method) || 'GET',
    ...param,
    headers: {
      ...(param && param.headers),
      'Content-Type': 'application/json'
    }
  })

  const contentType = response.headers.get('Content-Type')

  if (response.status !== 200 && !contentType.includes('application/json'))
    throw new Error('API error - status: ' + response.status)

  if (contentType && contentType.includes('application/json')) {
    const res = await response.json()

    if (res.error) throw new Error(res.message)
    return res
  }

  return response
}

export default { fetcher, call }
