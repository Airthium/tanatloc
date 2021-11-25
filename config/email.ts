/** @module Config.Email */

/**
 * Email token
 * @memberof Config.Email
 * @description Set by `EMAIL_TOKEN` environment variable or empty string
 */
export const TOKEN: string = process.env.EMAIL_TOKEN || ''

// Email types

/**
 * Subscription
 * @memberof Config.Email
 */
export const SUBSCRIBE: string = 'subscribe'

/**
 * Password recoverey
 * @memberof Config.Email
 */
export const PASSWORD_RECOVERY: string = 'passwordRecovery'

/**
 * Revalidate
 * @memberof Config.Email
 */
export const REVALIDATE: string = 'revalidate'
