import Sentry from '@/lib/sentry'

import { IRouteError } from '.'

/**
 * Route error
 * @memberof Route
 * @param status Status code
 * @param message Message
 * @param display Display
 * @returns Error
 */
export const error = (
  status: number,
  message: string,
  display: boolean = true
) => {
  const err: IRouteError = new Error(message)
  err.status = status

  if (display) {
    console.error(err)
    Sentry.captureException(err)
  }

  return err
}
