import Download from '../'

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

const mockSimulationGet = jest.fn()
jest.mock('../../simulation', () => ({
  get: async () => mockSimulationGet()
}))

const mockListFiles = jest.fn()
jest.mock('../../tools', () => ({
  listFiles: async () => mockListFiles()
}))

jest.mock('../createSummary', () => () => ({ path: 'path', name: 'name' }))
jest.mock('../createPVD', () => () => [{ path: 'path', name: 'name' }])

describe('lib/download', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockCreateReadStream.mockReset()
    mockCreateReadStream.mockImplementation(() => 'readStream')

    mockCreateWriteStream.mockReset()
    mockCreateWriteStream.mockImplementation(() => ({
      on: (type, callback) => callback(),
      write: () => {},
      end: () => {}
    }))

    mockArchiver.mockReset()
    mockArchiver.mockImplementation(() => ({
      on: (type, callback) => {
        if (type === 'error') return
        if (type === 'warning') callback('Warning')
      },
      pipe: jest.fn(),
      append: jest.fn(),
      finalize: jest.fn()
    }))

    mockSimulationGet.mockReset()
    mockSimulationGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          part: {},
          geometry: {
            file: { name: 'name' }
          },
          parameters: {
            index: 1,
            title: 'title',
            done: true,
            param: {
              label: 'label',
              children: [
                {
                  label: 'subLabel',
                  value: 'value'
                }
              ]
            },
            param2: {
              label: 'label',
              children: [
                {
                  label: 'subLabel',
                  default: 'value'
                }
              ]
            }
          }
        }
      }
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
      append: jest.fn(),
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
