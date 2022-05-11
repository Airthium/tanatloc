import Result from '..'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockArchiver = jest.fn()
jest.mock('archiver', () => () => mockArchiver())

jest.mock('@/config/storage', () => ({}))

const mockSimulationGet = jest.fn()
jest.mock('../../simulation', () => ({
  get: async () => mockSimulationGet()
}))

const mockReadFile = jest.fn()
const mockListFiles = jest.fn()
const mockReadStream = jest.fn()
const mockReadJSONFile = jest.fn()
const mockWriteStream = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile(),
  readJSONFile: async () => mockReadJSONFile(),
  listFiles: async () => mockListFiles(),
  readStream: () => mockReadStream(),
  writeStream: () => mockWriteStream()
}))

jest.mock('../createSummary', () => () => ({ path: 'path', name: 'name' }))
jest.mock('../createPVD', () => () => [{ path: 'path', name: 'name' }])

describe('lib/result', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockArchiver.mockReset()
    mockArchiver.mockImplementation(() => ({
      on: (type: string, callback: Function) => {
        if (type === 'error') return
        if (type === 'warning') callback('Warning')
      },
      pipe: jest.fn(),
      append: jest.fn(),
      finalize: jest.fn()
    }))

    mockSimulationGet.mockReset()
    mockSimulationGet.mockImplementation(() => ({}))

    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
    mockListFiles.mockReset()
    mockListFiles.mockImplementation(() => [
      { name: 'test.vtu', isFile: () => true },
      { name: 'test.glb', isFile: () => true }
    ])
    mockReadStream.mockReset()
    mockReadStream.mockImplementation(() => 'readStream')

    mockWriteStream.mockReset()
    mockWriteStream.mockImplementation(() => ({
      on: (_: any, callback: Function) => callback(),
      write: jest.fn(),
      end: jest.fn()
    }))
  })

  test('load', async () => {
    mockReadJSONFile.mockImplementation(() => ({
      uuid: 'uuid'
    }))
    const load = await Result.load(
      { id: 'id' },
      { originPath: 'originPath', glb: 'glb', json: 'json' }
    )
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(load).toEqual({ uuid: 'uuid', buffer: Buffer.from('readFile') })
  })

  test('download', () => {
    const download = Result.download(
      { id: 'id' },
      { originPath: 'originPath', fileName: 'fileName' }
    )
    expect(mockReadStream).toHaveBeenCalledTimes(1)
    expect(download).toBe('readStream')
  })

  test('archive', async () => {
    // Normal
    const archive = await Result.archive({ id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(5)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockReadStream).toHaveBeenCalledTimes(4)
    expect(mockWriteStream).toHaveBeenCalledTimes(1)
    expect(archive).toBe('readStream')

    // Error
    mockArchiver.mockImplementation(() => ({
      on: (type: string, callback: Function) => {
        if (type === 'error') callback(new Error())
        if (type === 'warning') callback('Warning')
      },
      pipe: jest.fn(),
      append: jest.fn(),
      finalize: jest.fn()
    }))
    try {
      await Result.archive({ id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
