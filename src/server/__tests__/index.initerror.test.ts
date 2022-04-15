const mockCreateServer = jest.fn()
jest.mock('http', () => ({
  createServer: (callback: () => {}) => mockCreateServer(callback)
}))

const mockParse = jest.fn()
jest.mock('url', () => ({
  parse: () => mockParse()
}))

const mockNext = jest.fn()
jest.mock('next', () => () => mockNext())

const mockInit = jest.fn()
jest.mock('../init', () => async () => mockInit())

const mockClean = jest.fn()
jest.mock('../clean', () => async () => mockClean())

describe('src/server', () => {
  beforeEach(() => {
    mockCreateServer.mockReset()
    mockCreateServer.mockImplementation((callback) => {
      callback({}, {})
      return {
        listen: jest.fn()
      }
    })

    mockParse.mockReset()

    mockNext.mockReset()
    mockNext.mockImplementation(() => ({
      prepare: async () => null,
      getRequestHandler: jest.fn
    }))

    mockInit.mockReset()
    mockInit.mockImplementation(() => {
      throw new Error('init error')
    })
    mockClean.mockReset()
  })

  test('call', async () => {
    Object.defineProperty(process, 'exit', { value: jest.fn })
    await import('..')
  })
})

export {}
