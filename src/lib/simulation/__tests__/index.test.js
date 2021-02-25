import Simulation from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({}))

const mockCompute = jest.fn()
const mockStop = jest.fn()
jest.mock('@/plugins/api', () => ({
  key: {
    computeSimulation: async () => mockCompute(),
    stop: async () => mockStop()
  }
}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('@/database/simulation', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

const mockUpdateProject = jest.fn()
jest.mock('../../project', () => ({
  update: async () => mockUpdateProject()
}))

const mockWriteFile = jest.fn()
const mockConvert = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  writeFile: async () => mockWriteFile(),
  convert: async () => mockConvert(),
  removeFile: async () => mockRemoveFile(),
  removeDirectory: async () => mockRemoveDirectory()
}))

// const mockCompute = jest.fn()
// jest.mock('../compute', () => ({
//   computeSimulation: async () => mockCompute()
// }))

describe('src/lib/simulation', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockUpdateProject.mockReset()
    mockWriteFile.mockReset()
    mockConvert.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()
    mockCompute.mockReset()
    mockStop.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    const simulation = await Simulation.add({
      project: { id: 'id' },
      simulation: { name: 'name', scheme: 'scheme' }
    })
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

  it('get', async () => {
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

  it('update', async () => {
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {}
        }
      }
    }))

    // Empty
    await Simulation.update({}, [])
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

    // With not a file
    await Simulation.update({}, [{}])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // Without scheme
    await Simulation.update({}, [{}])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // Without value
    await Simulation.update({}, [
      {
        key: 'scheme'
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With undefined file
    await Simulation.update({}, [
      {
        key: 'scheme',
        value: {
          file: undefined
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(5)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With file
    mockConvert.mockImplementation(() => ({
      path: 'path'
    }))
    await Simulation.update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['configuration', 'geometry'],
        value: {
          file: {
            name: 'name',
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(6)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockConvert).toHaveBeenCalledTimes(1)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)

    // With old file
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            file: {
              fileName: 'name',
              part: 'part',
              partPath: 'path',
              origin: 'origin',
              originPath: 'originPath'
            }
          }
        }
      }
    }))
    await Simulation.update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['configuration', 'geometry'],
        value: {
          file: {
            name: 'name',
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(6)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(7)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockConvert).toHaveBeenCalledTimes(2)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)

    // Remove error
    mockRemoveFile.mockImplementation(() => {
      throw new Error()
    })
    mockRemoveDirectory.mockImplementation(() => {
      throw new Error()
    })
    await Simulation.update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['configuration', 'geometry'],
        value: {
          file: {
            name: 'name',
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(10)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(8)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(3)
    expect(mockConvert).toHaveBeenCalledTimes(3)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)

    mockRemoveFile.mockImplementation(() => {})
    mockRemoveDirectory.mockImplementation(() => {})

    // With empty old file
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            file: {}
          }
        }
      }
    }))
    await Simulation.update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['configuration', 'geometry'],
        value: {
          file: {
            name: 'name',
            buffer: ['buffer']
          }
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(12)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(9)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(4)
    expect(mockConvert).toHaveBeenCalledTimes(4)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)

    // With file to remove
    await Simulation.update({ id: 'id' }, [
      {
        key: 'scheme',
        path: ['configuration', 'geometry'],
        value: {
          file: 'remove'
        }
      }
    ])
    expect(mockPath).toHaveBeenCalledTimes(12)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(10)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(4)
    expect(mockConvert).toHaveBeenCalledTimes(4)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)
  })

  it('delete', async () => {
    await Simulation.del({}, {})
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
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
    await Simulation.del({}, {})
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockUpdateProject).toHaveBeenCalledTimes(2)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)
  })

  it('run', async () => {
    // Normal
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      }
    }))
    await Simulation.run({})
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(1)

    // Error
    mockUpdate.mockReset()
    mockCompute.mockImplementation(() => {
      throw new Error()
    })
    await Simulation.run({})
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockConvert).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(0)
    expect(mockCompute).toHaveBeenCalledTimes(2)
  })

  it('stop', async () => {
    mockGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          run: {
            cloudServer: {
              key: 'key'
            }
          }
        }
      },
      tasks: [{ status: 'wait' }, { status: 'error' }]
    }))

    await Simulation.stop({})
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockStop).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
