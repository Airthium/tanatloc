process.env.STORAGE_PATH = 'storage'

const config = require('../storage')

describe('config/storage', () => {
  it('global', () => {
    expect(config.STORAGE).toBe('storage')
    expect(config.AVATAR).toBe('storage/avatar')
    expect(config.SIMULATION).toBe('storage/simulation')
  })
})
