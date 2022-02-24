/** @module API */

import isElectron from 'is-electron'

import {
  IFetchResponse,
  ICallResponse,
  ICallError,
  ICallHeaders
} from './index.d'

const port: number = parseInt(process.env.PORT) || 3000
const base: string = isElectron() ? 'http://localhost:' + port : ''

/**
 * Fetcher (for SWR)
 * @param url URL
 * @param payload Payload
 * @returns Response
 */
export const fetcher = async (
  url: string,
  payload?: string
): Promise<IFetchResponse> => {
  // Fetch
  const response = await fetch(base + url, {
    method: payload ? 'POST' : 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...(payload && { body: payload })
  })

  // Check content type
  const contentType = response.headers.get('Content-Type')

  // Check response status
  if (!response.ok) {
    const error: ICallError = new Error('An error occured while fetching data.')
    error.info =
      contentType?.includes('application/json') && (await response.json())
    error.status = response.status

    throw error
  }

  // Return response json
  return response.json()
}

/**
 * API call
 * @param route Route
 * @param param Parameters
 * @returns Response
 */
export const call = async (
  route: string,
  param?: { method?: string; headers?: ICallHeaders; body?: string }
): Promise<ICallResponse> => {
  // Fetch
  const response = await fetch(base + route, {
    ...param,
    method: (param && param.method) || 'GET',
    headers: {
      ...(param && param.headers),
      'Content-Type': 'application/json'
    }
  })

  // Check content type
  const contentType = response.headers.get('Content-Type')

  // Check response status
  if (!response.ok) {
    const error: ICallError = new Error('An error occured while fetching data.')
    error.info =
      contentType?.includes('application/json') && (await response.json())
    error.status = response.status

    throw error
  }

  // Return response
  return response
}
