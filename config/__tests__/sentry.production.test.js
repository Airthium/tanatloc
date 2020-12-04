process.env.NODE_ENV = 'production'
const config = require('../sentry')

describe('config/sentry', () => {
  it('global', () => {
    const config = require('../sentry')
    expect(config.DSN.length).toBe(73)
  })
})
