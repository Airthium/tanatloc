const config = require('../storage')

jest.mock('os', () => ({
  homedir: () => '/homedir'
}))

describe('config/storage', () => {
  it('global', () => {
    expect(config.STORAGE).toBe('/homedir/tanatloc')
    expect(config.AVATAR).toBe('/homedir/tanatloc/avatar')
    expect(config.SIMULATION).toBe('/homedir/tanatloc/simulation')
  })
})
