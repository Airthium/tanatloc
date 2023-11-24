import Geometry from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: (_: string, path: string) => mockPath(path)
}))

jest.mock('@airthium/extract-json-from-string', () => (str: string) => [
  JSON.parse(str)
])

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
const mockToolsReadFile = jest.fn()
const mockToolsWriteFile = jest.fn()
const mockToolsConvert = jest.fn()
const mockToolsRemoveFile = jest.fn()
const mockToolsSplitStep = jest.fn()
jest.mock('../../tools', () => ({
  copyFile: async (path: string) => mockToolsCopyFile(path),
  readFile: async (path: string) => mockToolsReadFile(path),
  writeFile: async () => mockToolsWriteFile(),
  convert: async () => mockToolsConvert(),
  removeFile: async () => mockToolsRemoveFile(),
  splitStep: async () => mockToolsSplitStep()
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
    mockToolsReadFile.mockReset()
    mockToolsWriteFile.mockReset()
    mockToolsConvert.mockReset()
    mockToolsRemoveFile.mockReset()
    mockToolsSplitStep.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockImplementation(() => ({}))
    mockToolsConvert.mockImplementation(() => [
      {
        glb: 'glb'
      }
    ])

    const summary = {
      uuid: 'uuid',
      dimension: 3,
      solids: [
        {
          uuid: 'uuid',
          name: 'name',
          number: 1
        },
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: { r: 0, g: 0.5, b: 1 }
        }
      ],
      faces: [
        { uuid: 'uuid', name: 'name', number: 1 },
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: { r: 0, g: 0.5, b: 1 }
        }
      ],
      edges: [
        { uuid: 'uuid', name: 'name', number: 1 },
        {
          uuid: 'uuid',
          name: 'name',
          number: 1,
          color: { r: 0, g: 0.5, b: 1 }
        }
      ]
    }
    mockToolsReadFile.mockImplementation(() =>
      JSON.stringify({
        scenes: [
          {
            extras: summary
          }
        ]
      })
    )

    // Normal
    const geometry = await Geometry.add(
      { id: 'id' },
      { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsConvert).toHaveBeenCalledTimes(1)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
    expect(geometry).toEqual({
      id: 'id',
      glb: 'glb',
      summary: summary
    })

    // With JSON{
    mockToolsReadFile.mockImplementation(
      () =>
        'JSON' +
        JSON.stringify({
          scenes: [
            {
              extras: summary
            }
          ]
        })
    )
    const geometry2 = await Geometry.add(
      { id: 'id' },
      { name: 'name.step', uid: 'test', buffer: Buffer.from('buffer') }
    )
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsConvert).toHaveBeenCalledTimes(2)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(2)
    expect(geometry2).toEqual({
      id: 'id',
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
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(3)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(3)
    expect(mockToolsConvert).toHaveBeenCalledTimes(2)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(2)
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
      brep: 'brep'
    }))
    await Geometry.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockPath).toHaveBeenCalledTimes(3)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(3)
    expect(mockDelete).toHaveBeenCalledTimes(2)

    // With errors
    mockToolsRemoveFile.mockImplementation(() => {
      throw new Error()
    })
    await Geometry.del({
      id: 'id',
      glb: 'glb',
      brep: 'brep'
    })
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(3)
    expect(mockPath).toHaveBeenCalledTimes(8)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(8)
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
      summary: {}
    }))
    mockToolsReadFile.mockImplementation(() => Buffer.from('buffer'))

    const part = await Geometry.readPart({ id: 'id' })
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(part).toEqual({
      summary: {},
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
      brep: 'brep'
    }))
    await Geometry.archive({ id: 'id' }, 'to')
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(3)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(3)
  })

  test('splitStep', async () => {
    mockAdd.mockImplementation(() => ({}))
    mockGet.mockImplementation(() => ({}))
    mockToolsReadFile.mockImplementation(() =>
      JSON.stringify({
        scenes: [{}]
      })
    )
    mockToolsConvert.mockImplementation(() => [
      {
        glb: 'glb'
      }
    ])
    mockToolsSplitStep.mockImplementation(() => [{}, {}])

    await Geometry.splitStep({ id: 'id' }, { id: 'id' })
    expect(mockToolsSplitStep).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(2)

    mockToolsSplitStep.mockImplementation(() => [{}])
    const message = await Geometry.splitStep({ id: 'id' }, { id: 'id' })
    expect(message).toBe('Only one volume found')

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await Geometry.splitStep({ id: 'id' }, { id: 'id' })
  })
})
