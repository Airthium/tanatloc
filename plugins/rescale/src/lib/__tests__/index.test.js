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
const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('@/lib/tools', () => ({
  createPath: async () => mockCreatePath(),
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile()
}))

const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  toThree: async (path, fileIn, pathOut, callback) =>
    mockToThree(path, fileIn, pathOut, callback)
}))

const mockCall = jest.fn()
jest.mock('../call', () => async (param) => mockCall(param))

describe('plugins/rescale/src/lib', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockRender.mockReset()
    mockCreatePath.mockReset()
    mockReadFile.mockReset()
    mockWriteFile.mockReset()
    mockToThree.mockReset()
    mockCall.mockReset()
  })

  it('init', async () => {
    // Normal
    mockCall.mockImplementation(() => ({ results: [{}] }))
    await Rescale.init({
      platform: {},
      token: {},
      additionalFiles: {
        value: ''
      }
    })
    expect(mockCall).toHaveBeenCalledTimes(2)

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
    jest.setTimeout(10000)

    mockReadFile.mockImplementation(() => 'readFile')
    mockToThree.mockImplementation((path, fileIn, pathOut, callback) => {
      callback({ error: 'Error' })
      callback({ data: 'Not a json' })
      callback({ data: '[{}]' })
      return 0
    })
    mockCall.mockImplementation((param) => {
      if (param.route === 'files/contents/') return '{}'
      else if (param.route === 'jobs/id/statuses/')
        return {
          results: [{ status: 'Completed' }]
        }
      else if (param.route === 'jobs/id/runs/1/files/')
        return {
          results: [
            { relativePath: 'test' },
            { relativePath: 'result/test' },
            { relativePath: 'result/test.vtu' }
          ]
        }
      return { id: 'id', results: [{}] }
    })

    // Standard
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {
            platform: {
              value: 'platform'
            },
            token: {
              value: 'token'
            },
            organization: {
              value: 'organization'
            },
            project: {
              value: 'project'
            },
            additionalFiles: {
              value: 'id, id'
            }
          },
          inUseConfiguration: {
            coreTypes: {
              value: 'coreType'
            },
            lowPriority: {
              value: true
            },
            numberOfCores: {
              value: 1
            },
            freefemVersion: {
              value: 'version'
            }
          }
        }
      }
    })

    // With meshes
    mockToThree.mockImplementation((path, fileIn, pathOut, callback) => {
      return -1
    })
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      geometry: {
        meshable: true,
        file: {
          fileName: 'fileName'
        }
      },
      boundaryConditions: {
        index: -1,
        dirichlet: {
          values: [{ selected: ['1'] }],
          refineFactor: 2
        },
        neumann: {}
      },
      run: {
        cloudServer: {
          configuration: {
            platform: {
              value: 'platform'
            },
            token: {
              value: 'token'
            },
            additionalFiles: {
              value: ''
            }
          },
          inUseConfiguration: {
            coreTypes: {
              value: 'coreType'
            },
            lowPriority: {
              value: true
            },
            numberOfCores: {
              value: 1
            },
            freefemVersion: {
              value: 'version'
            }
          }
        }
      }
    })

    // Play with status
    let count = 0
    mockCall.mockImplementation((param) => {
      if (param.route === 'files/contents/') return '{}'
      else if (param.route === 'jobs/id/statuses/') {
        count++
        if (count === 1)
          return {
            results: [
              {
                status: 'Queued',
                statusDate: '2016-04-21T17:07:04.761050Z',
                statusReason: null
              },
              {
                status: 'Pending',
                statusDate: '2016-04-21T17:06:32.086507Z',
                statusReason: null
              }
            ]
          }
        if (count < 4)
          return {
            results: [{ status: 'Executing' }]
          }
        else if (count < 5) return {}
        else
          return {
            results: [{ status: 'Completed' }]
          }
      } else if (param.route === 'jobs/id/runs/1/directory-contents/') {
        if (count === 2) return
        else
          return [
            { path: 'process_output.log', resource: 'this is the log file' }
          ]
      } else if (param.route === 'this is the log file') return 'log'
      else if (param.route === 'jobs/id/runs/1/files/') {
        return {
          results: [{ relativePath: 'process_output.log', id: 'id' }]
        }
      } else if (param.route === 'files/id/contents/') return 'log'
      return { id: 'id', results: [{}] }
    })
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {
            platform: {
              value: 'platform'
            },
            token: {
              value: 'token'
            },
            additionalFiles: {
              value: 'id, id'
            }
          },
          inUseConfiguration: {
            coreTypes: {
              value: 'coreType'
            },
            lowPriority: {
              value: true
            },
            numberOfCores: {
              value: 1
            },
            freefemVersion: {
              value: 'version'
            }
          }
        }
      }
    })

    // Warnings
    mockCall.mockImplementation((param) => {
      if (param.route === 'files/contents/') return '{}'
      else if (param.route === 'jobs/id/statuses/')
        return {
          results: [{ status: 'Completed' }]
        }
      else if (param.route === 'jobs/id/runs/1/files/')
        return {
          results: [{ relativePath: 'result/test.vtu' }]
        }
      else if (
        param.route === 'organizations/organization/jobs/id/project-assignment/'
      )
        throw new Error()
      return { id: 'id', results: [{}] }
    })
    mockToThree.mockImplementation(() => {
      throw new Error()
    })
    await Rescale.computeSimulation({ id: 'id' }, 'algorithm', {
      run: {
        cloudServer: {
          configuration: {
            platform: {
              value: 'platform'
            },
            token: {
              value: 'token'
            },
            organization: {
              value: 'organization'
            },
            project: {
              value: 'project'
            },
            additionalFiles: {
              value: 'id, id'
            }
          },
          inUseConfiguration: {
            coreTypes: {
              value: 'coreType'
            },
            lowPriority: {
              value: true
            },
            numberOfCores: {
              value: 1
            },
            freefemVersion: {
              value: 'version'
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
