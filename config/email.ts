/** @module Config.Email */

/**
 * Email token
 * @description Set by `EMAIL_TOKEN` environment variable or empty string
 */
export const TOKEN: string = process.env.EMAIL_TOKEN ?? ''

// Email types

/**
 * Subscription
 */
export const SUBSCRIBE: string = 'subscribe'

/**
 * Password recoverey
 */
export const PASSWORD_RECOVERY: string = 'passwordRecovery'

/**
 * Revalidate
 */
export const REVALIDATE: string = 'revalidate'
