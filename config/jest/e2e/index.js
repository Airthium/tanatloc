// Env
process.env.DB_DATABASE = 'tanatloc_test'
process.env.STORAGE_PATH = '/tmp/tanatloc_test'

// Jest
jest.setTimeout(20_000)

jest.mock('three', () => {
  const THREE = jest.requireActual('three')
  return {
    ...THREE,
    WebGLRenderer: jest.fn().mockReturnValue({
      domElement: global.document.createElement('div'),
      setClearColor: jest.fn(),
      setPixelRatio: jest.fn(),
      setSize: jest.fn(),
      render: jest.fn()
    })
  }
})
