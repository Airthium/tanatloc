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

const mockProjectUpdate = jest.fn()
jest.mock('../../project', () => ({
  update: async () => mockProjectUpdate()
}))

const mockGeometryGet = jest.fn()
jest.mock('../../geometry', () => ({
  get: async () => mockGeometryGet()
}))

const mockPluginCompute = jest.fn()
const mockPluginStop = jest.fn()
const mockPluginServerList = jest.fn()
jest.mock('../../plugins', () => ({
  serverList: () => mockPluginServerList()
}))

const mockToolsReadFile = jest.fn()
const mockToolsCopyFile = jest.fn()
const mockToolsCopyDirectory = jest.fn()
const mockToolsConvert = jest.fn()
const mockToolsRemoveFile = jest.fn()
const mockToolsRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  createPath: async () => {
    // Empty
  },
  readFile: async () => mockToolsReadFile(),
  copyFile: async () => mockToolsCopyFile(),
  copyDirectory: async () => mockToolsCopyDirectory(),
  convert: async () => mockToolsConvert(),
  removeFile: async () => mockToolsRemoveFile(),
  removeDirectory: async () => mockToolsRemoveDirectory()
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

    mockProjectUpdate.mockReset()

    mockGeometryGet.mockReset()

    mockToolsReadFile.mockReset()
    mockToolsCopyFile.mockReset()
    mockToolsCopyDirectory.mockReset()
    mockToolsConvert.mockReset()
    mockToolsRemoveFile.mockReset()
    mockToolsRemoveDirectory.mockReset()

    mockPluginServerList.mockImplementation(() => [
      {
        key: 'key',
        lib: {
          computeSimulation: async () => mockPluginCompute(),
          stop: async () => mockPluginStop()
        }
      }
    ])
    mockPluginCompute.mockReset()
    mockPluginStop.mockReset()
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
          //@ts-ignore
          configuration: {}
        }
      }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(simulation).toEqual({ id: 'id' })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({}))
    let simulation = await Simulation.get('id', ['tasks'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(simulation).toEqual({ tasks: [] })

    mockGet.mockImplementation(() => ({
      tasks: []
    }))
    simulation = await Simulation.get('id', ['tasks'])
    expect(simulation).toEqual({ tasks: [] })
  })

  test('getAll', async () => {
    mockGetAll.mockImplementation(() => [{ id: 'id' }])
    const simulations1 = await Simulation.getAll([])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(simulations1).toEqual([{ id: 'id' }])

    // With tasks
    const simulations2 = await Simulation.getAll(['tasks'])
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(simulations2).toEqual([{ id: 'id', tasks: [] }])

    // With tasks values
    mockGetAll.mockImplementation(() => [{ id: 'id', tasks: [] }])
    const simulations3 = await Simulation.getAll(['tasks'])
    expect(mockGetAll).toHaveBeenCalledTimes(3)
    expect(simulations3).toEqual([{ id: 'id', tasks: [] }])
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
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('delete', async () => {
    mockGet.mockImplementation(() => ({}))
    await Simulation.del({ id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(1)

    // Remove directory error
    mockToolsRemoveDirectory.mockImplementation(() => {
      throw new Error()
    })
    await Simulation.del({ id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(2)
  })

  test('run', async () => {
    // No configuration
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: undefined
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })

    // No cloudServer
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            value: 'id'
          },
          parameters: {},
          boundaryConditions: {},
          run: {}
        }
      }
    }))

    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(0)
    expect(mockPluginCompute).toHaveBeenCalledTimes(0)

    // Normal
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            value: 'id'
          },
          parameters: {},
          boundaryConditions: {},
          initialization: {
            direct: {
              children: [{}]
            }
          },
          run: {
            cloudServer: {
              key: 'key',
              configuration: {}
            }
          }
        }
      }
    }))
    mockUserGet.mockImplementation(() => ({
      plugins: [{ key: 'key', configuration: {} }],
      authorizedplugins: ['key']
    }))
    mockGeometryGet.mockImplementation(() => ({
      brep: 'file.brep'
    }))

    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(1)
    expect(mockPluginCompute).toHaveBeenCalledTimes(1)

    // With initialization coupling, wrong config
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            value: 'id'
          },
          parameters: {},
          initialization: {
            value: {
              type: 'coupling'
            }
          },
          boundaryConditions: {},
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(6)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(2)
    expect(mockPluginCompute).toHaveBeenCalledTimes(2)

    // With initialization coupling
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            value: 'id'
          },
          parameters: {},
          initialization: {
            value: {
              type: 'coupling',
              simulation: 'id',
              result: 'id'
            }
          },
          boundaryConditions: {},
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(11)
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(8)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(5)
    expect(mockPluginCompute).toHaveBeenCalledTimes(3)

    // With initialization default
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {},
          initialization: {
            value: {
              type: 'default'
            },
            direct: {
              children: [
                {
                  value: 1
                },
                { value: 1, unit: { label: 'm' } },
                { value: 1, unit: { label: 'm', multiplicator: 1, adder: 1 } }
              ]
            }
          },
          parameters: {},
          boundaryConditions: {},
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(12)
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockUpdate).toHaveBeenCalledTimes(10)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(5)
    expect(mockPluginCompute).toHaveBeenCalledTimes(4)

    // Error
    mockUpdate.mockReset()
    mockPluginCompute.mockImplementation(() => {
      throw new Error()
    })
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(13)
    expect(mockGet).toHaveBeenCalledTimes(7)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(5)
    expect(mockPluginCompute).toHaveBeenCalledTimes(5)

    // Unauthorized
    mockUserGet.mockImplementation(() => ({
      plugins: [],
      authorizedplugins: []
    }))
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(13)
    expect(mockGet).toHaveBeenCalledTimes(8)
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(5)
    expect(mockPluginCompute).toHaveBeenCalledTimes(5)

    // Missing plugin
    mockPluginServerList.mockImplementation(() => [])
    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(13)
    expect(mockGet).toHaveBeenCalledTimes(9)
    expect(mockUpdate).toHaveBeenCalledTimes(6)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(5)
    expect(mockPluginCompute).toHaveBeenCalledTimes(5)
  })

  test('run 2D', async () => {
    // Normal
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          dimension: 2,
          geometry: {
            value: 'id',
            meshParameters: {
              value: 1,
              unit: { label: 'm' }
            }
          },
          parameters: {
            title: 'title',
            key: {
              children: [
                {},
                {
                  value: 1
                },
                { value: 1, unit: { label: 'm' } },
                { value: 1, unit: { label: 'm', multiplicator: 1, adder: 1 } }
              ]
            }
          },
          boundaryConditions: {},
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    mockUserGet.mockImplementation(() => ({
      plugins: [],
      authorizedplugins: ['key']
    }))
    mockGeometryGet.mockImplementation(() => ({
      brep: 'file.brep'
    }))

    await Simulation.run({ id: 'id' }, { id: 'id' })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(1)
    expect(mockPluginCompute).toHaveBeenCalledTimes(1)
  })

  test('run geometries', async () => {
    // Normal
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            values: ['id1', 'id2'],
            meshParameters: {
              value: 1,
              unit: { label: 'm', multiplicator: 1, adder: 1 }
            }
          },
          parameters: {},
          materials: {
            values: [
              {
                geometry: 'id2',
                material: {
                  children: [
                    { value: 1 },
                    { value: 1, unit: { label: 'm' } },
                    {
                      value: 1,
                      unit: { label: 'm', multiplicator: 1, adder: 1 }
                    }
                  ]
                }
              }
            ]
          },
          boundaryConditions: {
            title: 'BC',
            first: {
              values: [
                {
                  geometry: 'id1',
                  selected: [{ label: 1 }],
                  values: [{ value: 1 }]
                },
                {
                  geometry: 'id2',
                  selected: [],
                  values: [
                    {},
                    { value: 1, unit: { label: 'm' } },
                    {
                      value: 1,
                      unit: { label: 'm', multiplicator: 1, adder: 1 }
                    }
                  ]
                }
              ]
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
    mockUserGet.mockImplementation(() => ({
      plugins: [],
      authorizedplugins: ['key']
    }))
    mockGeometryGet.mockImplementation(() => ({
      brep: 'file.brep'
    }))

    await Simulation.run({ id: 'id' }, { id: 'id' })

    expect(mockGeometryGet).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(2)

    // 2D
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          dimension: 2,
          geometry: {
            values: ['id1', 'id2']
          },
          parameters: {},
          materials: {
            values: [
              {
                geometry: 'id2',
                material: {
                  children: []
                }
              }
            ]
          },
          boundaryConditions: {
            title: 'BC',
            first: {
              values: [
                {
                  geometry: 'id1',
                  selected: [{ label: 1 }]
                },
                { geometry: 'id2', selected: [] }
              ]
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
    mockUserGet.mockImplementation(() => ({
      plugins: [],
      authorizedplugins: ['key']
    }))
    mockGeometryGet.mockImplementation(() => ({
      brep: 'file.brep'
    }))

    await Simulation.run({ id: 'id' }, { id: 'id' })

    expect(mockGeometryGet).toHaveBeenCalledTimes(4)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(4)
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
          },
          parameters: {}
        }
      },
      tasks: [{ status: 'wait' }, null, { status: 'error' }]
    }))

    await Simulation.stop({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockPluginStop).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Without configuration
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: undefined
      },
      tasks: [{ status: 'wait' }, null, { status: 'error' }]
    }))

    await Simulation.stop({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockPluginStop).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('getLog', async () => {
    mockToolsReadFile.mockImplementation(() => 'log')
    let log = await Simulation.getLog({ id: 'id' }, 'log')
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
    expect(log).toBe('log')

    // Error
    mockToolsReadFile.mockImplementation(() => {
      throw new Error()
    })
    log = await Simulation.getLog({ id: 'id' }, 'log')
    expect(mockToolsReadFile).toHaveBeenCalledTimes(2)
    expect(log.toString()).toBe('Not available yet')
  })

  test('archive', async () => {
    await Simulation.archive({ id: 'id' }, 'to')
    expect(mockToolsCopyDirectory).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(1)
  })

  test('copy', async () => {
    mockAdd.mockImplementation(() => ({}))
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          run: {}
        }
      }
    }))
    await Simulation.copy({ id: 'id' })
  })
})
