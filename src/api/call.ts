/** @namespace API */

interface CallError extends Error {
  info?: Object
  status?: number
}

import isElectron from 'is-electron'

const port: number = parseInt(process.env.PORT) || 3000
const base: string = isElectron() ? 'http://localhost:' + port : ''

/**
 * Fetcher (for SWR)
 * @memberof API
 * @param {string} url URL
 * @param {string} [payload] Payload
 */
const fetcher = async (url: string, payload: string): Promise<object> => {
  const res = await fetch(base + url, {
    method: payload ? 'POST' : 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...(payload && { body: payload })
  })

  if (!res.ok) {
    const error: CallError = new Error('An error occured while fetching data.')
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
const call = async (
  route: string,
  param?: { method?: string; headers?: object; body: string }
): Promise<object> => {
  const response = await fetch(base + route, {
    ...param,
    method: (param && param.method) || 'GET',
    headers: {
      ...(param && param.headers),
      'Content-Type': 'application/json'
    }
  })

  const contentType = response.headers.get('Content-Type')

  if (!response.ok) {
    const error: CallError = new Error('An error occured while fetching data.')
    error.info =
      contentType?.includes('application/json') && (await response.json())
    error.status = response.status

    throw error
  }

  if (contentType?.includes('application/json')) return response.json()

  return response
}

export default { fetcher, call }
