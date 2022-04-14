import { initDatabase } from '../database'

const mockCheckdB = jest.fn()
const mockStartdB = jest.fn()
jest.mock('@/database', () => ({
  checkdB: async () => mockCheckdB(),
  startdB: () => mockStartdB()
}))

describe('src/server/init/database', () => {
  beforeEach(() => {
    Object.defineProperty(global, 'tanatloc', { value: {}, configurable: true })
  })

  test('initDatabase', async () => {
    // No database
    try {
      await initDatabase()
    } catch (err: any) {
      expect(err.message).toBe('Database not found')
    }
    expect(mockCheckdB).toHaveBeenCalledTimes(1)

    // Database
    mockCheckdB.mockImplementation(() => true)
    mockStartdB.mockImplementation(() => 'pool')
    await initDatabase()
    //@ts-ignore
    expect(global.tanatloc.pool).toBe('pool')
    expect(mockCheckdB).toHaveBeenCalledTimes(2)
    expect(mockStartdB).toHaveBeenCalledTimes(1)
  })
})
