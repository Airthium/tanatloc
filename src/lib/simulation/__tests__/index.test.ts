import Simulation from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
const mockGetAll = jest.fn()
jest.mock('@/database/simulation', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete(),
  getAll: async () => mockGetAll()
}))

const mockUserGet = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockUserGet()
}))

const mockUpdateProject = jest.fn()
jest.mock('../../project', () => ({
  update: async () => mockUpdateProject()
}))

const mockGeometryGet = jest.fn()
jest.mock('../../geometry', () => ({
  get: async () => mockGeometryGet()
}))

const mockCompute = jest.fn()
const mockStop = jest.fn()
jest.mock('../../plugins', () => ({
  serverList: () => [
    {
      key: 'key',
      lib: {
        computeSimulation: async () => mockCompute(),
        stop: async () => mockStop()
      }
    }
  ]
}))

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
const mockCopyFile = jest.fn()
const mockConvert = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile(),
  copyFile: async () => mockCopyFile(),
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
    mockGetAll.mockReset()

    mockUserGet.mockReset()
    mockUserGet.mockImplementation(() => ({}))

    mockUpdateProject.mockReset()

    mockGeometryGet.mockReset()

    mockReadFile.mockReset()
    mockWriteFile.mockReset()
    mockCopyFile.mockReset()
    mockConvert.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()

    mockCompute.mockReset()
    mockStop.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    const simulation = await Simulation.add(
      { id: 'id' },
      {
        name: 'name',
        scheme: {
          category: 'category',
          name: 'name',
          algorithm: 'algorithm',
          code: 'code',
          version: 'version',
          description: 'description',
          configuration: {}
        }
      }
    )
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(simulation).toEqual({ id: 'id' })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({}))
    const simulation = await Simulation.get('id', [])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(simulation).toEqual({})
  })

  test('getAll', async () => {
    mockGetAll.mockImplementation(() => [{ id: 'id' }])
    const simulations = await Simulation.getAll([])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(simulations).toEqual([{ id: 'id' }])
  })

  test('update', async () => {
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {}
        }
      }
    }))

    await Simulation.update({ id: 'id' }, [{ key: 'key', value: 'value' }])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
  })

  test('delete', async () => {
    mockGet.mockImplementation(() => ({}))
    await Simulation.del({ id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)

    // Remove directory error
    mockRemoveDirectory.mockImplementation(() => {
      throw new Error()
    })
    await Simulation.del({ id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockUpdateProject).toHaveBeenCalledTimes(2)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)
  })

  test('run', async () => {
    // Normal
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {},
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    mockUserGet.mockImplementation(() => ({
      authorizedplugins: ['key']
    }))
    mockGeometryGet.mockImplementation(() => ({
      uploadfilename: 'uploadfilename',
      extension: 'extension'
    }))

    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(1)

    // With initialization coupling, wrong config
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {},
          initialization: {
            value: {
              type: 'coupling'
            }
          },
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockCopyFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(2)

    // With initialization coupling
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {},
          initialization: {
            value: {
              type: 'coupling',
              simulation: 'id',
              result: 'id'
            }
          },
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(8)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(6)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockCopyFile).toHaveBeenCalledTimes(5)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(3)

    // With initialization default
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {},
          initialization: {
            value: {
              type: 'default'
            }
          },
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(9)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(8)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockCopyFile).toHaveBeenCalledTimes(6)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(4)

    // Error
    mockUpdate.mockReset()
    mockCompute.mockImplementation(() => {
      throw new Error()
    })
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(10)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(5)

    // Unauthorized
    mockUserGet.mockImplementation(() => ({
      authorizedplugins: []
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(10)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(5)
  })

  test('stop', async () => {
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {},
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      },
      tasks: [{ status: 'wait' }, null, { status: 'error' }]
    }))

    await Simulation.stop({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockStop).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('getLog', async () => {
    mockReadFile.mockImplementation(() => 'log')
    const log = await Simulation.getLog({ id: 'id' }, 'log')
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(log).toBe('log')
  })
})
