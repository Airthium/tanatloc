describe('config/sentry', () => {
  it('global', () => {
    const config = require('../sentry')
    expect(config.DSN).toBe('')
  })
})
