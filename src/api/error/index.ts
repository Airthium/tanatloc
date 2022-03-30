/** @module API.Error */

import { ICallError } from '../index.d'

/**
 * API error
 */
export class APIError extends Error {
  title: string
  render: JSX.Element
  err: ICallError
  type: 'error' | 'success' | 'info' | 'warning'

  constructor(params: {
    title: string
    render?: JSX.Element
    err?: ICallError
    type?: 'error' | 'success' | 'info' | 'warning'
  }) {
    super(params.title)

    this.title = params.title
    this.name = 'APIError'
    this.render = params.render
    this.err = params.err
    this.type = params.type || 'error'
  }
}
