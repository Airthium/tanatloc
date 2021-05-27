/**
 * @jest-environment node
 */

describe('config/sentry', () => {
  test('global', () => {
    const config = require('../sentry')
    expect(config.DSN).toBe('')
  })
})
