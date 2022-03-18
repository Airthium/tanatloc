import '..'

jest.mock('child_process', () => ({
  execSync: () => ''
}))

const mockQuery = jest.fn(() => 'query')
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      connect: async () => ({
        query: async () => mockQuery(),
        release: jest.fn()
      }),
      query: async () => {
        throw new Error('no dB')
      },
      end: jest.fn()
    }))
  }
})

jest.mock('@/config/db', () => {
  return {}
})

describe('database', () => {
  test('call', async () => {
    // Nothing to do
  })
})
