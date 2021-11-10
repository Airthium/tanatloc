/** @namespace API */

import isElectron from 'is-electron'

const port = process.env.PORT || 3000
const base = isElectron() ? 'http://localhost:' + port : ''

/**
 * Fetcher (for SWR)
 * @memberof API
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
 * @memberof API
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

  if (!response.ok) {
    const error = new Error('An error occured while fetching data.')
    error.info =
      contentType?.includes('application/json') && (await response.json())
    error.status = response.status

    throw error
  }

  if (contentType?.includes('application/json')) return response.json()

  return response
}

export default { fetcher, call }
