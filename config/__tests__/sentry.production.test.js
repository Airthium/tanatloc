/**
 * @jest-environment node
 */

process.env.NODE_ENV = 'production'

describe('config/sentry', () => {
  test('global', () => {
    const config = require('../sentry')
    expect(config.DSN.length).toBe(73)
  })
})
