import Geometry from '..'

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

const mockReadFile = jest.fn()
const mockListFiles = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile(),
  listFiles: async () => mockListFiles()
}))

jest.mock('../createSummary', () => () => ({ path: 'path', name: 'name' }))
jest.mock('../createPVD', () => () => [{ path: 'path', name: 'name' }])

describe('lib/result', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockCreateReadStream.mockReset()
    mockCreateReadStream.mockImplementation(() => 'readStream')

    mockCreateWriteStream.mockReset()
    mockCreateWriteStream.mockImplementation(() => ({
      on: (_, callback) => callback(),
      write: jest.fn(),
      end: jest.fn()
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
    mockSimulationGet.mockImplementation(() => ({}))

    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'readFile')
    mockListFiles.mockReset()
    mockListFiles.mockImplementation(() => [
      { name: 'test.vtu', isFile: () => true },
      { name: 'test.glb', isFile: () => true }
    ])
  })

  test('load', async () => {
    const load = await Geometry.load({
      simulation: { id: 'id' },
      result: { originPath: 'originPath', glb: 'glb' }
    })
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(load).toEqual({ buffer: Buffer.from('readFile') })
  })

  test('download', () => {
    const download = Geometry.download({
      simulation: { id: 'id' },
      result: { originPath: 'originPath', fileName: 'fileName' }
    })
    expect(mockCreateReadStream).toHaveBeenCalledTimes(1)
    expect(download).toBe('readStream')
  })

  test('archive', async () => {
    // Normal
    const archive = await Geometry.archive({ simulation: { id: 'id' } })
    expect(mockPath).toHaveBeenCalledTimes(5)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockCreateReadStream).toHaveBeenCalledTimes(4)
    expect(mockCreateWriteStream).toHaveBeenCalledTimes(1)
    expect(archive).toBe('readStream')

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
      await Geometry.archive({ simulation: { id: 'id' } })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
