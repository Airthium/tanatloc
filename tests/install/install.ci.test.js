jest.mock('is-electron', () => () => false)
process.env.CI = true

describe('install (ci)', () => {
  test('Install', async () => {
    require('../../install')
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })
})
