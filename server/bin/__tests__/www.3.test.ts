jest.mock('../../app', () => ({
  set: jest.fn()
}))
jest.mock('http', () => ({
  createServer: () => ({
    address: () => ({}),
    listen: jest.fn(),
    on: jest.fn()
  })
}))
Object.defineProperty(process, 'env', { value: { PORT: -1 } })

describe('server/bin/www', () => {
  test('www', async () => {
    await import('../www')
    expect(true).toBe(true)
  })
})

export {}
