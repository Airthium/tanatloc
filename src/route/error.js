import Sentry from '@/lib/sentry'

/**
 * Route error
 * @memberof Route
 * @param {number} status Status code
 * @param {string} message Message
 * @param {?boolean} display Display (default: true)
 * @returns {Error} Error
 */
const error = (status, message, display = true) => {
  const err = new Error(message)
  err.status = status

  if (display) {
    console.error(err)
    Sentry.captureException(err)
  }

  return err
}

export default error
