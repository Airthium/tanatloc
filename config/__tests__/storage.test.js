const config = require('../storage')

describe('config/storage', () => {
  it('global', () => {
    expect(config.STORAGE).toBe('/tmp/tanatloc')
    expect(config.AVATAR).toBe('/tmp/tanatloc/avatar')
    expect(config.SIMULATION).toBe('/tmp/tanatloc/simulation')
  })
})
