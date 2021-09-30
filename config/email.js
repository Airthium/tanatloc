/** @namespace Config.Email */

/**
 * Email token
 * @memberof Config.Email
 */
const TOKEN = process.env.EMAIL_TOKEN || ''

// Email types

/**
 * Subscription
 * @memberof Config.Email
 */
const SUBSCRIBE = 'subscribe'

/**
 * Password recoverey
 * @memberof Config.Email
 */
const PASSWORD_RECOVERY = 'passwordRecovery'

/**
 * Revalidate
 * @memberof Config.Email
 */
const REVALIDATE = 'revalidate'

module.exports = {
  TOKEN,
  SUBSCRIBE,
  PASSWORD_RECOVERY,
  REVALIDATE
}
