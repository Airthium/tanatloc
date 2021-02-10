import Local from '../'

describe('plugins/local', () => {
  it('call', () => {
    expect(Local).toBeDefined()
    expect(Local.key).toBeDefined()
  })
})
