import Geometry from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: (_: string, path: string) => mockPath(path)
}))

jest.mock('@/config/storage', () => ({}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('@/database/geometry', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

const mockProjectUpdate = jest.fn()
jest.mock('../../project', () => ({
  update: async () => mockProjectUpdate()
}))

const mockReadFile = jest.fn()
const mockReadJSONFile = jest.fn()
const mockWriteFile = jest.fn()
const mockConvert = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async (path: string) => mockReadFile(path),
  readJSONFile: async (path: string) => mockReadJSONFile(path),
  writeFile: async () => mockWriteFile(),
  convert: async () => mockConvert(),
  removeFile: async () => mockRemoveFile(),
  removeDirectory: async () => mockRemoveDirectory()
}))

describe('lib/geometry', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockProjectUpdate.mockReset()

    mockReadFile.mockReset()
    mockReadJSONFile.mockReset()
    mockWriteFile.mockReset()
    mockConvert.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockImplementation(() => ({}))
    mockConvert.mockImplementation(() => ({
      json: 'json',
      glb: 'glb'
    }))
    const summary = {
      solids: [{}, {}],
      faces: [{}, {}],
      edges: [{}, {}]
    }
    mockReadJSONFile.mockImplementation(() => summary)

    // Normal
    const geometry = await Geometry.add(
      { id: 'id' },
      { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockConvert).toHaveBeenCalledTimes(1)
    expect(mockReadJSONFile).toHaveBeenCalledTimes(7)
    expect(geometry).toEqual({
      id: 'id',
      json: 'json',
      glb: 'glb',
      summary: summary
    })

    // Error
    mockGet.mockImplementation(() => ({}))
    mockWriteFile.mockImplementation(() => {
      throw new Error()
    })
    try {
      await Geometry.add(
        { id: 'id' },
        { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
      )
    } catch (err) {}
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockConvert).toHaveBeenCalledTimes(1)
    expect(mockReadJSONFile).toHaveBeenCalledTimes(7)
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({}))
    const geometry = await Geometry.get('id', [])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(geometry).toEqual({})
  })

  test('update', async () => {
    await Geometry.update({ id: 'id' }, [{ key: 'key', value: 'value' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('delete', async () => {
    mockGet.mockImplementation(() => ({}))
    await Geometry.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(1)

    // Remove files / directory
    mockGet.mockImplementation(() => ({
      uploadfilename: 'uploadfilename',
      extension: 'extension',
      glb: 'glb',
      json: 'json'
    }))
    await Geometry.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockPath).toHaveBeenCalledTimes(3)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(2)

    // With errors
    mockRemoveFile.mockImplementation(() => {
      throw new Error()
    })
    mockRemoveDirectory.mockImplementation(() => {
      throw new Error()
    })
    await Geometry.del({
      id: 'id',
      glb: 'glb',
      json: 'json'
    })
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(3)
    expect(mockPath).toHaveBeenCalledTimes(8)
    expect(mockRemoveFile).toHaveBeenCalledTimes(5)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(3)
    expect(mockDelete).toHaveBeenCalledTimes(3)
  })

  test('read', async () => {
    mockGet.mockImplementation(() => ({
      extension: 'extension',
      uploadfilename: 'uploadfilename'
    }))
    mockReadFile.mockImplementation(() => Buffer.from('buffer'))

    const read = await Geometry.read({ id: 'id' })
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(read).toEqual({
      buffer: Buffer.from('buffer'),
      extension: 'extension'
    })

    // No geometry
    mockGet.mockImplementation(() => {
      // empty mock
    })
    try {
      await Geometry.read({ id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Geometry does not exist.')
    }
  })

  test('readPart', async () => {
    mockPath.mockImplementation((path) => path)
    mockGet.mockImplementation(() => ({
      glb: 'glb',
      json: 'json'
    }))
    mockReadFile.mockImplementation(() => Buffer.from('buffer'))
    mockReadJSONFile.mockImplementation(() => ({ uuid: 'uuid' }))

    const part = await Geometry.readPart({ id: 'id' })
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockReadJSONFile).toHaveBeenCalledTimes(1)
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(part).toEqual({
      uuid: 'uuid',
      buffer: Buffer.from('buffer')
    })

    // No geometry
    mockGet.mockImplementation(() => {
      // empty mock
    })
    try {
      await Geometry.readPart({ id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Geometry does not exist.')
    }
  })
})
