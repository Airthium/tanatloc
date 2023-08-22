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
      callback({}, { end: jest.fn() })
      callback({}, { end: jest.fn() })
      return {
        listen: jest.fn()
      }
    })

    mockParse.mockReset()
    mockParse
      .mockImplementationOnce(() => 'url')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    mockNext.mockReset()
    mockNext.mockImplementation(() => ({
      prepare: async () => null,
      getRequestHandler: () => async () => {
        throw new Error()
      }
    }))

    mockInit.mockReset()
    mockClean.mockReset()
  })

  test('call', async () => {
    Object.defineProperty(process, 'exit', { value: jest.fn })
    Object.defineProperty(process, 'on', {
      value: (type: string, callback: (code: number) => {}) => {
        if (type === 'exit') callback(1)
      }
    })
    await import('..')
  })
})

export {}
