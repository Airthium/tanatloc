import Geometry from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
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
const mockWriteFile = jest.fn()
const mockConvert = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile(),
  convert: async () => mockConvert(),
  removeFile: async () => mockRemoveFile(),
  removeDirectory: async () => mockRemoveDirectory()
}))

describe('lib/simulation', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockProjectUpdate.mockReset()

    mockReadFile.mockReset()
    mockWriteFile.mockReset()
    mockConvert.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockConvert.mockImplementation(() => ({
      json: 'json',
      glb: 'glb'
    }))
    mockReadFile.mockImplementation(() => 'summary')

    // Normal
    const geometry = await Geometry.add({
      project: { id: 'id' },
      geometry: { name: 'name.step', uid: 'test', buffer: ['buffer'] }
    })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockConvert).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(geometry).toEqual({
      id: 'id',
      json: 'json',
      glb: 'glb',
      summary: 'summary'
    })

    // Error
    mockGet.mockImplementation(() => ({}))
    mockWriteFile.mockImplementation(() => {
      throw new Error()
    })
    try {
      await Geometry.add({
        project: { id: 'id' },
        geometry: { name: 'name.step', uid: 'test', buffer: ['buffer'] }
      })
    } catch (err) {}
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockConvert).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({}))
    const geometry = await Geometry.get('id', [])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(geometry).toEqual({})
  })

  test('update', async () => {
    await Geometry.update({}, [])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('delete', async () => {
    mockGet.mockImplementation(() => ({}))
    await Geometry.del({})
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
    await Geometry.del({})
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
    await Geometry.del({})
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(3)
    expect(mockPath).toHaveBeenCalledTimes(6)
    expect(mockRemoveFile).toHaveBeenCalledTimes(4)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(3)
  })

  test('read', async () => {
    mockGet.mockImplementation(() => ({
      extension: 'extension',
      uploadfilename: 'uploadfilename'
    }))
    mockReadFile.mockImplementation(() => 'buffer')

    const read = await Geometry.read({ id: 'id' })
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(read).toEqual({
      buffer: Buffer.from('buffer'),
      extension: 'extension'
    })
  })
})
