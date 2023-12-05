/** @module API.Error */

import { ReactNode } from 'react'

import { ICallError } from '../index.d'

/**
 * API error
 */
export class APIError extends Error {
  title: string
  render?: ReactNode
  err?: ICallError
  type?: 'error' | 'success' | 'info' | 'warning'

  constructor(params: {
    title: string
    render?: ReactNode
    err?: ICallError
    type?: 'error' | 'success' | 'info' | 'warning'
  }) {
    super(params.title)

    this.title = params.title
    this.name = 'APIError'
    this.render = params.render
    this.err = params.err
    this.type = params.type ?? 'error'
  }
}
