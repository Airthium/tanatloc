jest.mock('is-electron', () => () => true)

describe('install (electron)', () => {
  test('Install', async () => {
    require('../../install')
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })
})
