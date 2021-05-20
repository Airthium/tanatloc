/** @module api */

import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

/**
 * Fetcher (for SWR)
 * @param {string} url URL
 */
const fetcher = async (url, payload) => {
  const res = await fetch(base + url, {
    method: payload ? 'POST' : 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...(payload && { body: payload })
  })

  if (!res.ok) {
    const error = new Error('An error occured while fetching data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

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
