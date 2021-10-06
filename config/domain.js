/** @namespace Config.Domain */

/**
 * Domain
 * @memberof Config.Domain
 * @description Set by `DOMAIN` environment variale or `https://tanatloc.com`
 */
const DOMAIN = process.env.DOMAIN || 'https://tanatloc.com'

module.exports = {
  DOMAIN
}
