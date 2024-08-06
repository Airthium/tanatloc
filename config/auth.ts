/** @module Config.Auth */

/**
 * Authentication secret
 *
 * Default value `new Array(33).join('a')`
 */
export const SECRET: string = process.env.AUTH_SECRET ?? new Array(33).join('a')

// Default password configuration
/**
 * Min size
 *
 * Default value `6`
 */
export const MIN_SIZE: number = 6

/**
 * Max size
 *
 * Default value `16`
 */
export const MAX_SIZE: number = 16

/**
 * Require letter
 *
 * Default value `true`
 */
export const REQUIRE_LETTER: boolean = true

/**
 * Require number
 *
 * Default value `true`
 */
export const REQUIRE_NUMBER: boolean = true

/**
 * Require symbol
 *
 * Default value `true`
 */
export const REQUIRE_SYMBOL: boolean = true
