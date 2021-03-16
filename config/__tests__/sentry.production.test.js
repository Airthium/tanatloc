process.env.NODE_ENV = 'production'

describe('config/sentry', () => {
  it('global', () => {
    const config = require('../sentry')
    expect(config.DSN.length).toBe(73)
  })
})
