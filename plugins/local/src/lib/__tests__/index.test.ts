import { ISimulation, ISimulationTask } from '@/database/simulation'
import { IModel } from '@/models/index.d'

import Local from '..'

const mockAccess = jest.fn()
jest.mock('fs', () => ({
  promises: {
    access: async () => mockAccess(),
    constants: {
      X_OK: ''
    }
  }
}))

const mockExecSync = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync()
}))

const mockSetInterval = jest.fn()
jest.mock('set-interval-async/fixed', () => ({
  setIntervalAsync: (func: Function) => mockSetInterval(func)
}))

jest.mock('set-interval-async', () => ({
  clearIntervalAsync: () => undefined
}))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

jest.mock('@/config/storage', () => ({ SIMULATION: 'simulation' }))

const mockUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockGmsh = jest.fn()
const mockFreefem = jest.fn()
jest.mock('@/services', () => ({
  gmsh: async (
    path: string,
    mesh: string,
    geometry: string,
    callback: Function
  ) => mockGmsh(path, mesh, geometry, callback),
  freefem: async (path: string, script: string, callback: Function) =>
    mockFreefem(path, script, callback)
}))

const mockCreatePath = jest.fn()
const mockReadFile = jest.fn()
const mockConvert = jest.fn()
const mockListFiles = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('@/lib/tools', () => ({
  copyFile: async () => jest.fn(),
  toPosix: (path: string) => path,
  createPath: async () => mockCreatePath(),
  readFile: async () => mockReadFile(),
  convert: async (
    path: string,
    file: { name: string; target: string },
    callback: Function,
    param: { isResult: boolean }
  ) => mockConvert(path, file, callback, param),
  listFiles: async () => mockListFiles(),
  removeFile: async () => mockRemoveFile(),
  removeDirectory: async () => mockRemoveDirectory()
}))

const mockRender = jest.fn()
jest.mock('@/lib/template', () => ({
  render: async () => mockRender()
}))
const mockSimulationGet = jest.fn()
const mockSimulationUpdate = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockSimulationGet(),
  update: async () => mockSimulationUpdate()
}))

describe('plugins/local/src/lib', () => {
  beforeEach(() => {
    mockAccess.mockReset()

    mockExecSync.mockReset()

    mockSetInterval.mockReset()

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockUpdate.mockReset()

    mockConvert.mockReset()
    mockCreatePath.mockReset()
    mockReadFile.mockReset()
    mockListFiles.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()

    mockRender.mockReset()

    mockSimulationGet.mockReset()
    mockSimulationUpdate.mockReset()

    mockGmsh.mockReset()
    mockFreefem.mockReset()
  })

  test('keys', () => {
    expect(Local.key).toBeDefined()

    expect(Local.files.log).toBeDefined()
    expect(Local.files.data).toBeDefined()
    expect(Local.files.end).toBeDefined()

    expect(Local.paths.run).toBeDefined()
    expect(Local.paths.coupling).toBeDefined()
    expect(Local.paths.result).toBeDefined()
    expect(Local.paths.data).toBeDefined()
  })

  test('emptyFunction', () => {
    expect(Local.emptyFunction()).toBeUndefined()
  })

  test('init', async () => {
    // Empty
    await Local.init({
      freefemPath: { label: 'label', type: 'input' },
      gmshPath: { label: 'label', type: 'input' }
    })

    // Exec error
    mockExecSync.mockImplementation(() => {
      throw new Error('execSync error')
    })
    try {
      await Local.init({
        freefemPath: { label: 'label', type: 'input' },
        gmshPath: { label: 'label', type: 'input', value: 'path' }
      })
    } catch (err) {}
    try {
      await Local.init({
        freefemPath: { label: 'label', type: 'input', value: 'path' },
        gmshPath: { label: 'label', type: 'input' }
      })
    } catch (err) {}

    // Access error
    mockAccess.mockImplementation(() => {
      throw new Error('access error')
    })
    try {
      await Local.init({
        freefemPath: { label: 'label', type: 'input' },
        gmshPath: { label: 'label', type: 'input', value: 'path' }
      })
    } catch (err) {}
    try {
      await Local.init({
        freefemPath: { label: 'label', type: 'input', value: 'path' },
        gmshPath: { label: 'label', type: 'input' }
      })
    } catch (err) {}
  })

  test('updateTasks', () => {
    Local.updateTasks('id', [])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('clean', async () => {
    // Normal
    await Local.clean('path')
    expect(mockRemoveFile).toHaveBeenCalledTimes(3)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)

    // Error
    mockRemoveFile.mockImplementation(() => {
      throw new Error('removeFile error')
    })
    mockRemoveDirectory.mockImplementation(() => {
      throw new Error('removeDirectory error')
    })
    await Local.clean('path')
    expect(mockRemoveFile).toHaveBeenCalledTimes(6)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(4)
  })

  test('checkResults', async () => {
    // No files
    await Local.checkResults('id', { files: undefined } as ISimulationTask)

    // Files, no existing
    mockListFiles.mockImplementation(() => [])
    await Local.checkResults('id', {
      files: [{ fileName: 'file1' }]
    } as ISimulationTask)

    // Files, existing
    mockListFiles.mockImplementation(() => [
      { isFile: () => true, name: 'file1' }
    ])
    await Local.checkResults('id', {
      files: [{ fileName: 'file1' }]
    } as ISimulationTask)
  })

  test('checkDatas', async () => {
    // No files
    await Local.checkDatas('id', { datas: undefined } as ISimulationTask)

    // Datas, no existing
    mockListFiles.mockImplementation(() => [])
    await Local.checkDatas('id', {
      datas: [{ fileName: 'file1' }]
    } as ISimulationTask)

    // Files, existing
    mockListFiles.mockImplementation(() => [
      { isFile: () => true, name: 'file1' }
    ])
    await Local.checkDatas('id', {
      datas: [{ fileName: 'file1' }]
    } as ISimulationTask)
  })

  test('startProcess', async () => {
    const update = jest.fn()
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(() => {
      throw new Error('no file')
    })
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    const interval = Local.startProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })
    expect(interval).toBe('interval')

    Local.startProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })
  })

  test('stopProcess', async () => {
    const update = jest.fn()
    mockReadFile.mockImplementation(() => {
      throw new Error('no file')
    })

    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })
  })

  test('processResult', async () => {
    const update = jest.fn()
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(
      () => '{ "type": "VTU", "name": "Result.vtu" }'
    )
    Local.startProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    // Convert error
    mockConvert.mockImplementation(() => {
      throw new Error('Convert errror')
    })
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    // Convert error message
    mockConvert.mockImplementation((_, __, callback) => {
      callback({ error: 'Convert error' })
      callback({ data: 'Data' })
      return [{ name: 'name', glb: 'glb' }]
    })
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    // Ok
    mockConvert.mockImplementation(() => {
      return [{ name: 'name', glb: 'glb' }]
    })
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })
  })

  test('processData', async () => {
    const update = jest.fn()
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(
      () => '{ "type": "DATA", "name": "data.dat" }'
    )
    Local.startProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    // Error
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })

    // Ok
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 3) return JSON.stringify({ t: 0, x: 1 })
      return '{ "type": "DATA", "name": "data.dat" }'
    })
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })
    await Local.stopProcess('id', 'path', {
      currentTask: { index: 1, label: 'label', status: 'wait' },
      updateTasks: update
    })
  })

  test('computeMeshes', async () => {
    const update = jest.fn()
    mockGmsh.mockImplementation((_, __, ___, callback) => {
      callback({ data: 'data', error: 'error' })
      return 0
    })
    mockConvert.mockImplementation((_, __, callback) => {
      callback({ data: 'data', error: 'error' })
      return [
        {
          json: 'json',
          glb: 'glb'
        }
      ]
    })

    // Not meshable
    await Local.computeMeshes(
      'id',
      'path',
      {
        geometry: {
          index: 1,
          title: 'Geometry',
          children: [
            {
              noMeshable: true
            }
          ]
        },
        run: {}
      } as IModel['configuration'],
      { tasks: [], updateTasks: update }
    )

    // Missing data
    try {
      await Local.computeMeshes(
        'id',
        'path',
        {
          geometry: {
            index: 1,
            title: 'Geometry',
            children: [{}]
          },
          run: {}
        } as IModel['configuration'],
        { tasks: [], updateTasks: update }
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Missing data in geometry')
    }

    // Normal
    await Local.computeMeshes(
      'id',
      'path',
      {
        geometry: {
          index: 1,
          title: 'Geometry',
          children: [
            {
              data: {
                name: 'name',
                path: 'path',
                file: 'file'
              }
            }
          ]
        },
        run: {}
      } as IModel['configuration'],
      { tasks: [], updateTasks: update }
    )

    // 2D
    await Local.computeMeshes(
      'id',
      'path',
      {
        dimension: 2,
        geometry: {
          index: 1,
          title: 'Geometry',
          children: [
            {
              data: { name: 'name', path: 'path', file: 'file' }
            }
          ]
        },
        run: {}
      } as IModel['configuration'],
      { tasks: [], updateTasks: update }
    )

    // Mesh convert error
    mockConvert.mockImplementation(() => {
      throw new Error()
    })
    try {
      await Local.computeMeshes(
        'id',
        'path',
        {
          geometry: {
            index: 1,
            title: 'Geometry',
            children: [
              {
                data: { name: 'name', path: 'path', file: 'file' }
              }
            ]
          },
          run: {}
        } as IModel['configuration'],
        { tasks: [], updateTasks: update }
      )
      expect(true).toBe(false)
    } catch (err) {
    } finally {
      mockConvert.mockImplementation(() => [{}])
    }
    // Error
    mockGmsh.mockReset()
    try {
      await Local.computeMeshes(
        'id',
        'path',
        {
          geometry: {
            index: 1,
            title: 'Geometry',
            children: [
              {
                data: { name: 'name', path: 'path', file: 'file' }
              }
            ]
          },
          run: {}
        } as IModel['configuration'],
        { tasks: [], updateTasks: update }
      )
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  test('computeSimulation', async () => {
    Date.now = () => 500 + 250 * Math.random()
    mockFreefem.mockImplementation((_, __, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(
      () => '{ "type": "DATA", "name": "Result.dat" }'
    )
    mockSimulationGet.mockImplementation(() => ({
      tasks: [{ type: 'mesh' }]
    }))

    // No scheme
    try {
      await Local.computeSimulation(
        { id: 'id' },
        //@ts-ignore
        undefined
      )
    } catch (err) {}

    // Empty
    await Local.computeSimulation(
      { id: 'id' },
      {
        algorithm: 'algorithm',
        customFreeFEMPlugins: [{ path: 'path', file: 'file' }],
        configuration: { geometry: {}, run: {} }
      } as ISimulation<'scheme'[]>['scheme'],
      true
    )

    // Simulation error
    mockExecSync.mockImplementation(() => {
      throw new Error('')
    })
    mockFreefem.mockImplementation((_, __, callback) => {
      callback({})
      return 1
    })
    try {
      await Local.computeSimulation({ id: 'id' }, {
        algorithm: 'algorithm',
        customFreeFEMPlugins: [
          { path: 'path', file: 'file', headers: ['header.h'], mpi: true }
        ],
        configuration: {
          geometry: { children: [] },
          run: {}
        }
      } as unknown as ISimulation<'scheme'[]>['scheme'])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    //With mesh
    mockIsElectron.mockImplementation(() => true)
    process.resourcesPath = 'resources'
    mockFreefem.mockImplementation((_, __, callback) => {
      callback({ pid: 'pid' })
      return 0
    })
    mockGmsh.mockImplementation((_, __, ___, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockConvert.mockImplementation(() => [{}])
    await Local.computeSimulation(
      { id: 'id' },
      {
        algorithm: 'algorithm',
        customFreeFEMPlugins: [
          { path: 'path', file: 'file', headers: ['header.h'], mpi: true }
        ],
        //@ts-ignore
        configuration: {
          geometry: {
            index: 1,
            title: 'Geometry',
            children: [
              {
                label: 'Label',
                data: { name: 'name', path: 'path', file: 'file' },
                meshParameters: {
                  type: 'auto',
                  value: 'normal'
                },
                mesh: {}
              }
            ]
          },
          boundaryConditions: {
            index: 0,
            title: 'Boundary conditions',
            key1: {
              label: 'key1'
            },
            key2: {
              label: 'key2',
              values: [
                {
                  uuid: 'uuid',
                  name: 'name',
                  type: {
                    key: 'key',
                    label: 'label'
                  },
                  geometry: 'id',
                  selected: [{ uuid: 'uuid', label: 1 }]
                }
              ],
              refineFactor: 5
            }
          },
          run: {
            index: 0,
            title: 'Run'
          }
        }
      }
    )

    // Coupling
    Date.now = () => 0
    await Local.computeSimulation(
      { id: 'id' },
      {
        algorithm: 'algorithm',
        //@ts-ignore
        configuration: {
          geometry: {
            index: 1,
            title: 'Geometry',
            children: [
              {
                label: 'Label',
                data: { name: 'name', path: 'path', file: 'file' }
              }
            ]
          },
          initialization: {
            index: 1,
            title: 'Initialization',
            value: {
              type: 'coupling'
            }
          },
          boundaryConditions: {
            index: 0,
            title: 'Boundary conditions',
            key1: {
              label: 'key1'
            },
            key2: {
              label: 'key2',
              values: [
                {
                  uuid: 'uuid',
                  name: 'name',
                  type: {
                    key: 'key',
                    label: 'label'
                  },
                  geometry: 'id',
                  selected: [{ uuid: 'uuid', label: 1 }]
                }
              ],
              refineFactor: 5
            }
          },
          run: {
            index: 0,
            title: 'Run'
          }
        }
      }
    )

    // Meshing error
    mockGmsh.mockImplementation((_, __, ___, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 1
    })
    try {
      await Local.computeSimulation(
        { id: 'id' },
        {
          algorithm: 'algorithm',
          configuration: {
            geometry: {
              children: [
                {
                  label: 'Label',
                  noMeshable: true,
                  //@ts-ignore
                  file: {
                    originPath: 'originPath',
                    fileName: 'fileName'
                  }
                }
              ]
            },
            boundaryConditions: {
              index: 0,
              title: 'Boundary conditions',
              key1: {
                label: 'label'
              },
              key2: {
                label: 'label',
                values: [
                  {
                    uuid: 'uuid',
                    name: 'name',
                    type: {
                      key: 'key',
                      label: 'label'
                    },
                    geometry: 'id',
                    selected: [{ uuid: 'uuid', label: 1 }]
                  }
                ],
                refineFactor: 5
              }
            },
            run: {
              index: 0,
              title: 'Run'
            }
          }
        }
      )
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    // No simulation
    mockSimulationGet.mockImplementation(() => undefined)
    try {
      await Local.computeSimulation({ id: 'id' }, {
        configuration: {}
      } as ISimulation['scheme'])
    } catch (err: any) {
      expect(err.message).toBe('Simulation not found')
    }
  })

  test('computeSimulation (with startProcess mock)', async () => {
    mockFreefem.mockImplementation(() => {
      return 0
    })
    mockSimulationGet.mockImplementation(() => ({
      tasks: []
    }))
    jest
      .spyOn(Local, 'startProcess')
      .mockImplementationOnce(
        (_id: string, _simulationPath: string, { updateTasks: callback }) => {
          callback()
          return 'id' as any
        }
      )
    await Local.computeSimulation({ id: 'id' }, {
      algorithm: 'algorithm',
      configuration: {
        geometry: {
          children: []
        },
        run: {}
      }
    } as unknown as ISimulation<'scheme'[]>['scheme'])
  })

  test('monitoring', async () => {
    mockReadFile.mockImplementation(
      () => '{ "type": "DATA", "name": "Result.dat" }'
    )
    await Local.monitoring('id', '_', {
      tasks: [{ index: 1, label: 'label', status: 'wait' }],
      currentTask: {
        index: 1,
        label: 'Task',
        status: 'finish'
      },
      updateTasks: jest.fn
    })
  })

  test('stop', async () => {
    const mockKill = jest
      .spyOn(process, 'kill')
      .mockImplementation((_: number) => true)
    await Local.stop('id', [
      { index: 1, label: 'label', status: 'finish' },
      { index: 1, label: 'label', status: 'wait' },
      { index: 1, label: 'label', pid: '0', status: 'process' }
    ])
    expect(mockKill).toHaveBeenCalledTimes(1)

    // Start process
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    Local.startProcess('id', '_', {
      currentTask: {} as ISimulationTask,
      updateTasks: jest.fn
    })
    await Local.stop('id', [
      { index: 1, label: 'label', status: 'finish' },
      { index: 1, label: 'label', status: 'wait' },
      { index: 1, label: 'label', pid: '0', status: 'process' }
    ])
  })

  test('processResult', async () => {
    await Local.processResult(
      'new_id',
      { type: 'VTU', name: 'result', geometry: 'id' },
      'path',
      {
        currentTask: { index: 1, label: 'task', status: 'process' },
        updateTasks: () => undefined
      }
    )
  })

  test('processData', async () => {
    await Local.processData(
      'new_id',
      { type: 'DATA', name: 'data', geometry: 'id' },
      'path',
      {
        currentTask: { index: 1, label: 'task', status: 'process' },
        updateTasks: () => undefined
      }
    )
  })
})
