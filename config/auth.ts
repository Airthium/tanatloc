/** @namespace Config.Auth */

/**
 * Authentication secret
 * @memberof Config.Auth
 * @description Default value `new Array(33).join('a')`
 */
export const SECRET: string = process.env.AUTH_SECRET || new Array(33).join('a')

// Default password configuration
/**
 * Min size
 * @memberof Config.Auth
 * @description Default value `6`
 */
export const MIN_SIZE: number = 6

/**
 * Max size
 * @memberof Config.Auth
 * @description Default value `16`
 */
export const MAX_SIZE: number = 16

/**
 * Require letter
 * @memberof Config.Auth
 * @description Default value `true`
 */
export const REQUIRE_LETTER: boolean = true

/**
 * Require number
 * @memberof Config.Auth
 * @description Default value `true`
 */
export const REQUIRE_NUMBER: boolean = true

/**
 * Require symbol
 * @memberof Config.Auth
 * @description Default value `true`
 */
export const REQUIRE_SYMBOL: boolean = true
