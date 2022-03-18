import { query } from '..'

jest.mock('child_process', () => ({
  execSync: () => 'host'
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
        await new Promise((resolve) => setTimeout(resolve, 200))
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
  test('query', async () => {
    const res = await query('test', [])
    expect(res).toBe('query')
  })
})
