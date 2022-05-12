import Postprocessing from '..'

jest.mock('@/config/storage', () => ({
  SIMULATION: 'SIMULATION'
}))

const mockPvpython = jest.fn()
jest.mock('@/services', () => ({
  pvpython: async () => mockPvpython()
}))

const mockCopyFile = jest.fn()
const mockRemoveFile = jest.fn()
const mockConvert = jest.fn()
jest.mock('@/lib/tools', () => ({
  copyFile: async () => mockCopyFile(),
  removeFile: async () => mockRemoveFile(),
  convert: async (_: any, __: any, callback: Function) => mockConvert(callback)
}))

describe('lib/postprocessing', () => {
  beforeEach(() => {
    mockPvpython.mockReset()

    mockCopyFile.mockReset()
    mockRemoveFile.mockReset()
    mockConvert.mockReset()
  })

  test('run', async () => {
    mockPvpython.mockImplementation(() => ({ code: 0 }))
    mockConvert.mockImplementation((callback) => {
      callback({
        data: JSON.stringify({
          fileName: 'fileName',
          name: 'name',
          path: 'path'
        })
      })
    })

    const res = await Postprocessing.run(
      { id: 'id' },
      { fileName: 'fileName.vtu', originPath: 'originPath' },
      'filter',
      ['']
    )
    expect(res).toEqual([
      {
        fileName: 'fileName_filter.vtu',
        name: 'name',
        originPath: 'originPath',
        json: 'path',
        glb: 'path.glb'
      }
    ])

    // Convert error
    mockConvert.mockImplementation((callback) => {
      callback({ error: 'error', data: 'data' })
    })
    try {
      await Postprocessing.run(
        { id: 'id' },
        { fileName: 'fileName', originPath: 'originPath' },
        'filter',
        ['']
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'Error: Post-processing converting process failed (error)'
      )
    }

    // pvpython error 1
    mockPvpython.mockImplementation(() => ({
      code: 1,
      data: 'data',
      error: 'error'
    }))
    try {
      await Postprocessing.run(
        { id: 'id' },
        { fileName: 'fileName', originPath: 'originPath' },
        'filter',
        ['']
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'Post-processing script failed. Code 1\ndata\nerror'
      )
    }

    // pvpython error 2
    mockPvpython.mockImplementation(() => ({
      code: 1
    }))
    try {
      await Postprocessing.run(
        { id: 'id' },
        { fileName: 'fileName', originPath: 'originPath' },
        'filter',
        ['']
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Post-processing script failed. Code 1')
    }
  })
})