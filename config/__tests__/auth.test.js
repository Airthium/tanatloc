const config = require('../auth')

describe('config/auth', () => {
  it('global', () => {
    expect(config.SECRET).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  })
})
