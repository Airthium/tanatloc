import File from '../file'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockCreateReadStream = jest.fn()
jest.mock('fs', () => ({
  createReadStream: () => mockCreateReadStream()
}))

jest.mock('@/config/storage', () => ({}))

const mockReadFile = jest.fn()
jest.mock('../tools', () => ({
  readFile: async () => mockReadFile()
}))

describe('src/lib/file', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockCreateReadStream.mockReset()
    mockCreateReadStream.mockImplementation(() => 'readStream')
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

  it('createStream', () => {
    const stream = File.createStream(
      { id: 'id' },
      { originPath: 'originPath', fileName: 'fileName' }
    )
    expect(stream).toBe('readStream')
  })
})
