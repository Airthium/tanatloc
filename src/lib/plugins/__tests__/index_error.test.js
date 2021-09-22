import '..'

jest.mock('fs', () => ({
  promises: {
    readdir: async () => {
      throw new Error('readdir error')
    }
  }
}))

describe('lib/plugins', () => {
  test('load', async () => {
    // Nothing to do
  })
})
