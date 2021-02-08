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

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('@/lib/tools', () => ({
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile()
}))

const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  toThree: async () => mockToThree()
}))

const mockCall = jest.fn()
jest.mock('../call', (param) => async (param) => mockCall(param))

describe('plugin/rescale/src/lib', () => {
  beforeEach(() => {
    mockUpdate.mockReset()
    mockRender.mockReset()
    mockReadFile.mockReset()
    mockWriteFile.mockReset()
    mockToThree.mockReset()
    mockCall.mockReset()
  })

  it('init', async () => {
    // Normal
    mockCall.mockImplementation(() => ({ results: [{}] }))
    const res = await Rescale.init({
      platform: {},
      token: {}
    })
    expect(mockCall).toHaveBeenCalledTimes(2)

    // Invalid token
    mockCall.mockImplementation(() => ({ detail: 'Invalid token.' }))
    try {
      await Rescale.init({
        platform: {},
        token: {}
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('computeMesh', async () => {
    await Rescale.computeMesh()
  })

  it('computeSimulation', async () => {
    mockReadFile.mockImplementation(() => 'readFile')
    mockCall.mockImplementation((param) => {
      console.log(param)
      if (param.route === 'files/contents/') return '{}'
      if (param.route === 'jobs/id/statuses/')
        return {
          results: [{ status: 'Completed' }]
        }
      if (param.route === 'jobs/id/runs/1/files/')
        return {
          results: [
            { relativePath: 'test' },
            { relativePath: 'result/test' },
            { relativePath: 'result/test.vtu' }
          ]
        }
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
  })
})
