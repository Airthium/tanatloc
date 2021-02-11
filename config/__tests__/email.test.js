const config = require('../email')

describe('config/email', () => {
  it('global', () => {
    expect(config.TOKEN).toBe('')
  })
})
