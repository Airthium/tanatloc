/** @namespace Config.Auth */

/**
 * Authentication secret
 * @memberof Config.Auth
 * @description Default value `new Array(33).join('a')`
 */
const SECRET = process.env.AUTH_SECRET || new Array(33).join('a')

// Default password configuration
/**
 * Min size
 * @memberof Config.Auth
 * @description Default value `6`
 */
const MIN_SIZE = 6

/**
 * Max size
 * @memberof Config.Auth
 * @description Default value `16`
 */
const MAX_SIZE = 16

/**
 * Require letter
 * @memberof Config.Auth
 * @description Default value `true`
 */
const REQUIRE_LETTER = true

/**
 * Require number
 * @memberof Config.Auth
 * @description Default value `true`
 */
const REQUIRE_NUMBER = true

/**
 * Require symbol
 * @memberof Config.Auth
 * @description Default value `true`
 */
const REQUIRE_SYMBOL = true

module.exports = {
  SECRET,
  MIN_SIZE,
  MAX_SIZE,
  REQUIRE_LETTER,
  REQUIRE_NUMBER,
  REQUIRE_SYMBOL
}
