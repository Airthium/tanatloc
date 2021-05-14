import Rescale from '..'

jest.mock('@/config/storage', () => ({
  SIMULATION: 'SIMULATION'
}))

const mockUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockRender = jest.fn()
jest.mock('@/lib/template', () => ({
  render: async () => mockRender()
}))

const mockCreatePath = jest.fn()
jest.mock('@/lib/tools', () => ({
  createPath: async () => mockCreatePath()
}))

const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  toThree: async (path, fileIn, pathOut, callback) =>
    mockToThree(path, fileIn, pathOut, callback)
}))

const mockGetFreeFEM = jest.fn()
const mockCheckFiles = jest.fn()
const mockUpdateTasks = jest.fn()
const mockUploadFile = jest.fn()
const mockUploadFiles = jest.fn()
const mockCreateJob = jest.fn()
const mockSubmitJob = jest.fn()
const mockGetStatus = jest.fn()
const mockGetInRunFiles = jest.fn()
const mockGetInRunFile = jest.fn()
const mockGetFiles = jest.fn()
const mockGetFile = jest.fn()
const mockGetInRunOutputs = jest.fn()
const mockGetOutputs = jest.fn()
jest.mock('../tools', () => ({
  getFreeFEM: async () => mockGetFreeFEM(),
  checkFiles: async () => mockCheckFiles(),
  updateTasks: async () => mockUpdateTasks(),
  uploadFile: async () => mockUploadFile(),
  uploadFiles: async () => mockUploadFiles(),
  createJob: async () => mockCreateJob(),
  submitJob: async () => mockSubmitJob(),
  getStatus: async () => mockGetStatus(),
  getInRunFiles: async () => mockGetInRunFiles(),
  getInRunFile: async () => mockGetInRunFile(),
  getFiles: async () => mockGetFiles(),
  getFile: async () => mockGetFile(),
  getInRunOutputs: async () => mockGetInRunOutputs(),
  getOutputs: async () => mockGetOutputs()
}))

const mockCall = jest.fn()
jest.mock('../call', () => async (param) => mockCall(param))

describe('plugins/rescale/src/lib', () => {
  beforeEach(() => {
    mockUpdate.mockReset()

    mockRender.mockReset()

    mockCreatePath.mockReset()

    mockToThree.mockReset()

    mockGetFreeFEM.mockReset()
    mockUpdateTasks.mockReset()
    mockUploadFile.mockReset()
    mockUploadFiles.mockReset()
    mockCreateJob.mockReset()
    mockSubmitJob.mockReset()
    mockGetStatus.mockReset()
    mockGetInRunFiles.mockReset()
    mockGetInRunFile.mockReset()
    mockGetFiles.mockReset()
    mockGetFile.mockReset()
    mockGetInRunOutputs.mockReset()
    mockGetOutputs.mockReset()

    mockCall.mockReset()
  })

  it('init', async () => {
    // Normal
    mockCall.mockImplementation(() => ({ results: [{}] }))
    mockGetFreeFEM.mockImplementation(() => [{}])
    const res = await Rescale.init({
      platform: {},
      token: {},
      additionalFiles: {
        value: ''
      }
    })
    expect(mockCall).toHaveBeenCalledTimes(1)
    expect(mockCheckFiles).toHaveBeenCalledTimes(1)
    expect(mockGetFreeFEM).toHaveBeenCalledTimes(1)
    expect(res).toEqual({ data: { coreTypes: [{}], freefem: [{}] } })

    // Invalid token
    mockCall.mockImplementation(() => ({ detail: 'Invalid token.' }))
    try {
      await Rescale.init({
        platform: {},
        token: {},
        additionalFiles: {
          value: ''
        }
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('computeSimulation', async () => {
    jest.setTimeout(20000)

    mockUploadFile.mockImplementation(() => ({}))
    mockGetStatus.mockImplementation(() => 'Completed')
    mockGetInRunFiles.mockImplementation(() => [])
    mockGetFiles.mockImplementation(() => [])

    // Minimal
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    // With geometries, meshes
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      geometry1: {
        meshable: true,
        file: {
          fileName: 'fileName'
        }
      },
      geometry2: {
        meshable: false,
        file: {
          fileName: 'fileName'
        }
      },
      boundaryConditions: {
        index: 0,
        key1: {},
        key2: {
          values: [
            {
              selected: [1]
            }
          ],
          refineFactor: 5
        }
      },
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    // With files
    mockGetFiles.mockImplementation(() => [
      {
        relativePath: 'process_log.log'
      },
      {
        relativePath: 'process_data.log'
      }
    ])
    mockGetFile.mockImplementation(() => 'log')
    mockGetOutputs.mockImplementation(() => 'realLog')
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    mockGetFile.mockImplementation(() => ({ detail: 'not found' }))
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    // With in-run files
    let statusCount = 0
    mockGetStatus.mockImplementation(() => {
      statusCount++
      return statusCount === 1 ? 'Executing' : 'Completed'
    })
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    statusCount = 0
    mockGetInRunFiles.mockImplementation(() => [
      {
        path: 'process_log.log'
      },
      {
        path: 'process_data.log'
      }
    ])
    mockGetInRunFile.mockImplementation(() => 'log')
    mockGetInRunOutputs.mockImplementation(() => 'realLog')
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    mockGetInRunFile.mockImplementation(() => ({ detail: 'not found' }))
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    // Other status
    statusCount = 0
    mockGetStatus.mockImplementation(() => {
      statusCount++
      return statusCount === 1 ? 'Unknow' : 'Completed'
    })
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {},
          inUseConfiguration: {
            numberOfCores: {
              value: 64
            }
          }
        }
      }
    })

    // Error
    try {
      await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('stop', async () => {
    const tasks = [
      {
        status: 'other'
      },
      {
        status: 'process'
      }
    ]
    const configuration = {
      run: {
        cloudServer: {
          configuration: {
            platform: {
              value: 'platform'
            },
            token: {
              value: 'token'
            }
          }
        }
      }
    }
    await Rescale.stop(tasks, configuration)
    expect(mockCall).toHaveBeenCalledTimes(2)
  })
})
