/**
 * @jest-environment node
 */

export {}

describe('config/sentry', () => {
  test('global', () => {
    const config = require('../sentry')
    expect(config.DSN).toBe('')
  })
})
