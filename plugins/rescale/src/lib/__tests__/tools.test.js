import * as Tools from '../tools'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockSimulationUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockSimulationUpdate()
}))

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('@/lib/tools', () => ({
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile()
}))

const mockCaptureException = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockCaptureException()
}))

const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  toThree: async () => mockToThree()
}))

const mockCall = jest.fn()
jest.mock('../call', () => async (param) => mockCall(param))

describe('plugins/rescale/src/lib/tools', () => {
  const configuration = {
    platform: {
      value: 'platform'
    },
    token: {
      value: 'token'
    },
    additionalFiles: {
      value: 'id1,id2'
    }
  }
  const parameters = {
    coreTypes: {
      value: 'coreTypes'
    },
    lowPriority: {
      value: false
    },
    numberOfCores: {
      value: 64
    },
    freefemVersion: {
      value: 'xx'
    }
  }

  beforeEach(() => {
    mockPath.mockReset()

    mockSimulationUpdate.mockReset()

    mockReadFile.mockReset()
    mockWriteFile.mockReset()

    mockCaptureException.mockReset()

    mockToThree.mockReset()

    mockCall.mockReset()
  })

  it('getFreeFEM', async () => {
    mockCall.mockImplementation(() => ({
      results: [{ code: 'freefem', version: 'xx' }]
    }))
    const res = await Tools.getFreeFEM(configuration)
    expect(res).toEqual({ code: 'freefem', version: 'xx' })
  })

  it('checkFiles', async () => {
    mockCall.mockImplementation(() => ({}))
    const res = await Tools.checkFiles(configuration)
    expect(res).toBe()

    mockCall.mockImplementation(() => ({ detail: 'Not found.' }))
    try {
      await Tools.checkFiles(configuration)
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('updateTasks', async () => {
    await Tools.updateTasks()
    expect(mockSimulationUpdate).toHaveBeenCalledTimes(1)
  })

  it('uploadFile', async () => {
    mockReadFile.mockImplementation(() => 'readFile')
    mockCall.mockImplementation(() => '{ "id": "id" }')
    const file = await Tools.uploadFile(configuration)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(file).toEqual({ id: 'id', name: undefined })
  })

  it('uploadFiles', async () => {
    mockReadFile.mockImplementation(() => 'readFile')
    mockCall.mockImplementation(() => '{ "id": "id" }')

    const files = await Tools.uploadFiles(configuration, [{}], {})
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(files).toEqual([{ id: 'id', name: undefined }])

    // Without task
    await Tools.uploadFiles(configuration, [{}])
  })

  it('createJob', async () => {
    configuration.additionalFiles.value = undefined
    mockCall.mockImplementation(() => ({ id: 'id' }))
    const job = await Tools.createJob(
      'algorithm',
      configuration,
      parameters,
      'command',
      [{}],
      [{}],
      {}
    )
    expect(job).toBe('id')

    // With additionalFiles, organization & projects
    configuration.additionalFiles.value = 'file1'
    configuration.organization = { value: 'org' }
    configuration.project = { value: 'project' }
    await Tools.createJob(
      'algorithm',
      configuration,
      parameters,
      'command',
      [{}],
      [{}],
      {}
    )
    expect(job).toBe('id')

    // With project-assignment error
    let callCount = 0
    mockCall.mockImplementation(() => {
      callCount++
      if (callCount === 1) return {}
      throw new Error()
    })

    await Tools.createJob(
      'algorithm',
      configuration,
      parameters,
      'command',
      [{}],
      [{}],
      {}
    )
    expect(mockCaptureException).toHaveBeenCalledTimes(1)
  })

  it('submitJob', async () => {
    await Tools.submitJob(configuration)
    expect(mockCall).toHaveBeenCalledTimes(1)
  })

  it('getStatus', async () => {
    mockCall.mockImplementation(() => ({}))

    // Empty response (Rescale bug - bad Content-Type header)
    let status = await Tools.getStatus(configuration)
    expect(status).toBe('Completed')

    mockCall.mockImplementation(() => ({
      results: [
        { statusDate: '0', status: 'Completed' },
        { statusDate: '1', status: 'Executing' }
      ]
    }))
    status = await Tools.getStatus(configuration)
    expect(status).toBe('Executing')
  })

  it('getInRunFiles', async () => {
    let files = await Tools.getInRunFiles(configuration)
    expect(files).toEqual([])

    mockCall.mockImplementation(() => [{}])
    files = await Tools.getInRunFiles(configuration)
    expect(files).toEqual([{}])
  })

  it('getInFunFile', async () => {
    const file = await Tools.getInRunFile(configuration, {
      resource: 'api/v2/file'
    })
    expect(file).toBe()
  })

  it('getFiles', async () => {
    mockCall.mockImplementation(() => ({
      results: [{}]
    }))
    const files = await Tools.getFiles(configuration)
    expect(files).toEqual([{}])
  })

  it('getFile', async () => {
    const file = await Tools.getFile(configuration)
    expect(file).toBe()
  })

  it('getInRunOuputs', async () => {
    // Log only
    await Tools.getInRunOutputs(
      configuration,
      'log',
      [],
      [],
      [],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // With results & data
    mockCall.mockImplementation(() => '{ "string": "string" }')
    mockToThree.mockImplementation(() => ({
      code: 0,
      error: '',
      data: '{ "test": "test" }'
    }))
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result2.vtu'
        },
        {
          resource: 'resource',
          path: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Three bad code
    mockToThree.mockImplementation(() => ({
      code: 1
    }))
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result2.vtu'
        },
        {
          resource: 'resource',
          path: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Three stderr
    mockToThree.mockImplementation(() => ({
      code: 0,
      error: 'error'
    }))
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result2.vtu'
        },
        {
          resource: 'resource',
          path: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Three err, write err
    mockToThree.mockImplementation(() => {
      throw new Error()
    })
    mockWriteFile.mockImplementation(() => {
      throw new Error()
    })
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result2.vtu'
        },
        {
          resource: 'resource',
          path: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Not a string
    mockCall.mockImplementation(() => ({}))
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result2.vtu'
        },
        {
          resource: 'resource',
          path: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Inactive run
    mockCall.mockImplementation(() => ({ detail: 'detail' }))
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result2.vtu'
        },
        {
          resource: 'resource',
          path: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // No available file
    mockCall.mockImplementation(() => ({ detail: 'detail' }))
    await Tools.getInRunOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          resource: 'resource',
          path: 'result3.vtu'
        },
        {
          resource: 'resource',
          path: 'data3.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )
  })

  it('getOuputs', async () => {
    // Log only
    await Tools.getOutputs(
      configuration,
      'log',
      [],
      [],
      [],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // With results & data
    mockCall.mockImplementation(() => '{ "string": "string" }')
    mockToThree.mockImplementation(() => ({
      code: 0,
      error: '',
      data: '{ "test": "test" }'
    }))
    await Tools.getOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          relativePath: 'result2.vtu'
        },
        {
          relativePath: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Three bad code
    mockToThree.mockImplementation(() => ({
      code: 1
    }))
    await Tools.getOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          relativePath: 'result2.vtu'
        },
        {
          relativePath: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Three stderr
    mockToThree.mockImplementation(() => ({
      code: 0,
      error: 'error'
    }))
    await Tools.getOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          relativePath: 'result2.vtu'
        },
        {
          relativePath: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // Three err, write err
    mockToThree.mockImplementation(() => {
      throw new Error()
    })
    mockWriteFile.mockImplementation(() => {
      throw new Error()
    })
    await Tools.getOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          relativePath: 'result2.vtu'
        },
        {
          relativePath: 'data2.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )

    // No available file
    mockCall.mockImplementation(() => ({ detail: 'detail' }))
    await Tools.getOutputs(
      configuration,
      'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat',
      [
        {
          relativePath: 'result3.vtu'
        },
        {
          relativePath: 'data3.dat'
        }
      ],
      ['result1.vtu'],
      ['data1.dat'],
      [],
      'path',
      'path',
      'path',
      {}
    )
  })
})
