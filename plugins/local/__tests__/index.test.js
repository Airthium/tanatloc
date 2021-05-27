import Local from '../'

describe('plugins/local', () => {
  test('call', () => {
    expect(Local).toBeDefined()
    expect(Local.key).toBeDefined()
  })
})
