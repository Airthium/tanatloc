import File from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({}))

const mockReadFile = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile()
}))

describe('src/lib/file', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
  })

  it('get', async () => {
    const content = await File.get(
      { id: 'id' },
      { origin: 'origin', originPath: 'originPath' }
    )
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toEqual({
      buffer: 'readFile'
    })
  })
})
