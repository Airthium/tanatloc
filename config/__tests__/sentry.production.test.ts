/**
 * @jest-environment node
 */

Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' })
export {}

describe('config/sentry', () => {
  test('global', () => {
    const config = require('../sentry')
    expect(config.DSN.length).toBe(73)
  })
})
