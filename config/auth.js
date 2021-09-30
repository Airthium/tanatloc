/** @namespace Config.Auth */

/**
 * Authentication secret
 * @memberof Config.Auth
 */
const SECRET = process.env.AUTH_SECRET || new Array(33).join('a')

// Default password configuration
/**
 * Min size
 * @memberof Config.Auth
 */
const MIN_SIZE = 6

/**
 * Max size
 * @memberof Config.Auth
 */
const MAX_SIZE = 16

/**
 * Require letter
 * @memberof Config.Auth
 */
const REQUIRE_LETTER = true

/**
 * Require number
 * @memberof Config.Auth
 */
const REQUIRE_NUMBER = true

/**
 * Require symbol
 * @memberof Config.Auth
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
