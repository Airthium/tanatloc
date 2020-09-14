const config = require('../sentry')

describe('config/sentry', () => {
  it('global', () => {
    expect(config.DSN).toBe('')
  })
})
