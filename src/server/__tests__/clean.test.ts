import clean from '../clean'

const mockExecSync = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync()
}))

const mockStopdB = jest.fn()
jest.mock('@/database', () => ({
  stopdB: async () => mockStopdB()
}))

describe('src/server/clean', () => {
  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => '')
  })

  test('clean', async () => {
    await clean()
    expect(mockExecSync).toHaveBeenCalledTimes(1)
  })

  test('clean docker', async () => {
    mockExecSync.mockImplementation(() => 'id')
    await clean()
    expect(mockExecSync).toHaveBeenCalledTimes(2)
  })
})
