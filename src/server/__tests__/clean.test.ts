import clean from '../clean'

const mockStopdB = jest.fn()
jest.mock('@/database', () => ({
  stopdB: async () => mockStopdB()
}))

describe('src/server/clean', () => {
  test('clean', async () => {
    await clean()
  })
})
