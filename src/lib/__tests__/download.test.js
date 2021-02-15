import Download from '../download'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockCreateReadStream = jest.fn()
const mockCreateWriteStream = jest.fn()
jest.mock('fs', () => ({
  createReadStream: () => mockCreateReadStream(),
  createWriteStream: () => mockCreateWriteStream()
}))

const mockArchiver = jest.fn()
jest.mock('archiver', () => () => mockArchiver())

jest.mock('@/config/storage', () => ({}))

const mockListFiles = jest.fn()
jest.mock('../tools', () => ({
  listFiles: async () => mockListFiles()
}))

describe('lib/download', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockCreateReadStream.mockReset()
    mockCreateReadStream.mockImplementation(() => 'readStream')

    mockCreateWriteStream.mockReset()
    mockCreateWriteStream.mockImplementation(() => ({
      on: (type, callback) => callback()
    }))

    mockArchiver.mockReset()
    mockArchiver.mockImplementation(() => ({
      on: (type, callback) => {
        if (type === 'error') return
        if (type === 'warning') callback('Warning')
      },
      pipe: jest.fn(),
      file: jest.fn(),
      finalize: jest.fn()
    }))

    mockListFiles.mockReset()
    mockListFiles.mockImplementation(() => [{ isFile: () => true }])
  })

  it('createArchiveStream', async () => {
    const archiveStream = await Download.createArchiveStream({ id: 'id' })
    expect(archiveStream).toBe('readStream')

    // Error
    mockArchiver.mockImplementation(() => ({
      on: (type, callback) => {
        if (type === 'error') callback(new Error())
        if (type === 'warning') callback('Warning')
      },
      pipe: jest.fn(),
      file: jest.fn(),
      finalize: jest.fn()
    }))
    try {
      await Download.createArchiveStream({ id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('createReadStream', () => {
    const stream = Download.createReadStream(
      { id: 'id' },
      { originPath: 'originPath', fileName: 'fileName' }
    )
    expect(stream).toBe('readStream')
  })
})
