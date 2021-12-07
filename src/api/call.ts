/** @module API */

import isElectron from 'is-electron'

import {
  ICallError,
  ICallHeaders,
  ICallResponse,
  IFetchResponse
} from './index.d'

const port: number = parseInt(process.env.PORT) || 3000
const base: string = isElectron() ? 'http://localhost:' + port : ''

/**
 * Fetcher (for SWR)
 * @memberof API
 * @param url URL
 * @param payload Payload
 */
export const fetcher = async (
  url: string,
  payload?: string
): Promise<IFetchResponse> => {
  const response = await fetch(base + url, {
    method: payload ? 'POST' : 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...(payload && { body: payload })
  })

  const contentType = response.headers.get('Content-Type')

  if (!response.ok) {
    const error: ICallError = new Error('An error occured while fetching data.')
    error.info =
      contentType?.includes('application/json') && (await response.json())
    error.status = response.status

    throw error
  }

  return response.json()
}

/**
 * API call
 * @memberof API
 * @param route Route
 * @param param Parameters
 * @returns Response
 */
export const call = async (
  route: string,
  param?: { method?: string; headers?: ICallHeaders; body?: string }
): Promise<ICallResponse> => {
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
    const error: ICallError = new Error('An error occured while fetching data.')
    error.info =
      contentType?.includes('application/json') && (await response.json())
    error.status = response.status

    throw error
  }

  return response
}
