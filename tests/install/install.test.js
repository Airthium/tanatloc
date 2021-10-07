jest.mock('is-electron', () => () => false)

describe('install', () => {
  test('Install', async () => {
    require('../../install')
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })
})
