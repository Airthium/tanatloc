import { ICallError } from '../index.d'

/**
 * API error
 */
export class APIError extends Error {
  constructor(public title: string, public err?: ICallError) {
    super(title)

    this.name = 'APIError'
  }
}
