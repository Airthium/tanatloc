import Geometry from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: (_: string, path: string) => mockPath(path)
}))

jest.mock('@/config/storage', () => ({
  GEOMETRY: 'geometry'
}))

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

const mockToolsCopyFile = jest.fn()
const mockToolsCopyDirectory = jest.fn()
const mockToolsReadFile = jest.fn()
const mockToolsReadJSONFile = jest.fn()
const mockToolsWriteFile = jest.fn()
const mockToolsConvert = jest.fn()
const mockToolsRemoveFile = jest.fn()
const mockToolsRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  copyFile: async (path: string) => mockToolsCopyFile(path),
  copyDirectory: async (path: string) => mockToolsCopyDirectory(path),
  readFile: async (path: string) => mockToolsReadFile(path),
  readJSONFile: async (path: string) => mockToolsReadJSONFile(path),
  writeFile: async () => mockToolsWriteFile(),
  convert: async () => mockToolsConvert(),
  removeFile: async () => mockToolsRemoveFile(),
  removeDirectory: async () => mockToolsRemoveDirectory()
}))

describe('lib/geometry', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockProjectUpdate.mockReset()

    mockToolsCopyFile.mockReset()
    mockToolsCopyDirectory.mockReset()
    mockToolsReadFile.mockReset()
    mockToolsReadJSONFile.mockReset()
    mockToolsWriteFile.mockReset()
    mockToolsConvert.mockReset()
    mockToolsRemoveFile.mockReset()
    mockToolsRemoveDirectory.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockImplementation(() => ({}))
    mockToolsConvert.mockImplementation(() => ({
      json: 'json',
      glb: 'glb'
    }))
    const summary = {
      uuid: 'uuid',
      solids: [
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: undefined
        },
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: { r: 0, g: 0.5, b: 1 }
        }
      ],
      faces: [
        { uuid: 'uuid', name: 'name', number: 1, color: undefined },
        { uuid: 'uuid', name: 'name', number: 1, color: { r: 0, g: 0.5, b: 1 } }
      ],
      edges: [
        { uuid: 'uuid', name: 'name', number: 1, color: undefined },
        { uuid: 'uuid', name: 'name', number: 1, color: { r: 0, g: 0.5, b: 1 } }
      ]
    }
    const solid = {
      uuid: 'uuid'
    }
    const solidColor = {
      uuid: 'uuid',
      data: {
        attributes: {
          color: { itemSize: 3, array: [0, 0.5, 1] }
        }
      }
    }
    const face = { uuid: 'uuid' }
    const faceColor = {
      uuid: 'uuid',
      data: {
        attributes: {
          color: { itemSize: 3, array: [0, 0.5, 1] }
        }
      }
    }
    const edge = { uuid: 'uuid' }
    const edgeColor = {
      uuid: 'uuid',
      data: {
        attributes: {
          color: { itemSize: 3, array: [0, 0.5, 1] }
        }
      }
    }
    mockToolsReadJSONFile
      .mockImplementationOnce(() => summary)
      .mockImplementationOnce(() => solid)
      .mockImplementationOnce(() => solidColor)
      .mockImplementationOnce(() => face)
      .mockImplementationOnce(() => faceColor)
      .mockImplementationOnce(() => edge)
      .mockImplementationOnce(() => edgeColor)

    // Normal
    const geometry = await Geometry.add(
      { id: 'id' },
      { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsConvert).toHaveBeenCalledTimes(1)
    expect(mockToolsReadJSONFile).toHaveBeenCalledTimes(7)
    expect(geometry).toEqual({
      dimension: 3,
      id: 'id',
      json: 'json',
      glb: 'glb',
      summary: summary
    })

    // Error
    mockGet.mockImplementation(() => ({}))
    mockToolsWriteFile.mockImplementation(() => {
      throw new Error()
    })
    try {
      await Geometry.add(
        { id: 'id' },
        { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
      )
    } catch (err) {}
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsConvert).toHaveBeenCalledTimes(1)
    expect(mockToolsReadJSONFile).toHaveBeenCalledTimes(7)
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('add 2d', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockImplementation(() => ({}))
    mockToolsConvert.mockImplementation(() => ({
      json: 'json',
      glb: 'glb'
    }))
    const summary = {
      uuid: 'uuid',
      faces: [
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: undefined
        },
        { uuid: 'uuid', name: 'name', number: 1, color: { r: 0, g: 0.5, b: 1 } }
      ],
      edges: [
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: undefined
        },
        { uuid: 'uuid', name: 'name', number: 1, color: { r: 0, g: 0.5, b: 1 } }
      ]
    }
    const face = { uuid: 'uuid' }
    const faceColor = {
      uuid: 'uuid',
      data: {
        attributes: {
          color: { itemSize: 3, array: [0, 0.5, 1] }
        }
      }
    }
    const edge = { uuid: 'uuid' }
    const edgeColor = {
      uuid: 'uuid',
      data: {
        attributes: {
          color: { itemSize: 3, array: [0, 0.5, 1] }
        }
      }
    }
    mockToolsReadJSONFile
      .mockImplementationOnce(() => summary)
      .mockImplementationOnce(() => face)
      .mockImplementationOnce(() => faceColor)
      .mockImplementationOnce(() => edge)
      .mockImplementationOnce(() => edgeColor)

    // Normal
    const geometry = await Geometry.add(
      { id: 'id' },
      { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsConvert).toHaveBeenCalledTimes(1)
    expect(mockToolsReadJSONFile).toHaveBeenCalledTimes(5)
    expect(geometry).toEqual({
      dimension: 2,
      id: 'id',
      json: 'json',
      glb: 'glb',
      summary: summary
    })
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
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(2)

    // With errors
    mockToolsRemoveFile.mockImplementation(() => {
      throw new Error()
    })
    mockToolsRemoveDirectory.mockImplementation(() => {
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
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(5)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(3)
    expect(mockDelete).toHaveBeenCalledTimes(3)
  })

  test('read', async () => {
    mockGet.mockImplementation(() => ({
      extension: 'extension',
      uploadfilename: 'uploadfilename'
    }))
    mockToolsReadFile.mockImplementation(() => Buffer.from('buffer'))

    const read = await Geometry.read({ id: 'id' })
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
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
    } catch (err: any) {
      expect(err.message).toBe('Geometry does not exist.')
    }
  })

  test('readPart', async () => {
    mockPath.mockImplementation((path) => path)
    mockGet.mockImplementation(() => ({
      glb: 'glb',
      json: 'json'
    }))
    mockToolsReadFile.mockImplementation(() => Buffer.from('buffer'))
    mockToolsReadJSONFile.mockImplementation(() => ({ uuid: 'uuid' }))

    const part = await Geometry.readPart({ id: 'id' })
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
    expect(mockToolsReadJSONFile).toHaveBeenCalledTimes(1)
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
    } catch (err: any) {
      expect(err.message).toBe('Geometry does not exist.')
    }
  })

  test('archive', async () => {
    // Empty
    mockGet.mockImplementation(() => ({}))
    await Geometry.archive({ id: 'id' }, 'to')
    expect(mockGet).toHaveBeenCalledTimes(1)

    // Full
    mockGet.mockImplementation(() => ({
      uploadfilename: 'uploadfilename',
      glb: 'glb',
      json: 'json'
    }))
    await Geometry.archive({ id: 'id' }, 'to')
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyDirectory).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(1)
  })
})
