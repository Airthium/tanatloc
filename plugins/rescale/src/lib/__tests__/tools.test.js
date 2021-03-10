import * as Tools from '../tools'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockSimulationUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockSimulationUpdate()
}))

jest.mock('@/lib/tools', () => ({}))

jest.mock('@/lib/sentry', () => ({}))

jest.mock('@/services', () => ({}))

const mockCall = jest.fn()
jest.mock('../call', () => async (param) => mockCall(param))

describe('plugins/rescale/src/lib/tools', () => {
  const configuration = {
    platform: {
      value: 'platform'
    },
    token: {
      value: 'token'
    }
  }

  beforeEach(() => {
    mockPath.mockReset()

    mockSimulationUpdate.mockReset()

    mockCall.mockReset()
  })

  it('getFreeFEM', async () => {
    mockCall.mockImplementation(() => ({
      results: [{ code: 'freefem', version: 'xx' }]
    }))
    const res = await Tools.getFreeFEM(configuration)
    expect(res).toEqual({ code: 'freefem', version: 'xx' })
  })

  it('updateTasks', async () => {
    await Tools.updateTasks()
    expect(mockSimulationUpdate).toHaveBeenCalledTimes(1)
  })

  it('uploadFile', async () => {
    //TODO
  })
})
