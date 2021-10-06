import '..'

jest.mock('../../tools', () => ({
  listDirectories: async () => {
    throw new Error('')
  }
}))

describe('lib/plugins', () => {
  test('load', async () => {
    // Nothing to do
  })
})
