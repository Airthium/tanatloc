import init, { initPlugins, initTemplates } from '..'

const mockLoadPlugins = jest.fn()
const mockRestartJobs = jest.fn()
jest.mock('@/lib/plugins', () => ({
  loadPlugins: () => mockLoadPlugins(),
  restartJobs: () => mockRestartJobs()
}))

const mockLoadTemplates = jest.fn()
jest.mock('@/lib/template', () => ({
  loadTemplates: () => mockLoadTemplates()
}))

const mockInitDatabase = jest.fn()
jest.mock('../database', () => ({
  initDatabase: () => mockInitDatabase()
}))

describe('src/server/init', () => {
  beforeEach(() => {
    Object.defineProperty(global, 'tanatloc', { value: {}, configurable: true })
  })

  test('init', async () => {
    await init()
    expect(mockInitDatabase).toHaveBeenCalledTimes(1)
    expect(mockLoadPlugins).toHaveBeenCalledTimes(1)
    expect(mockRestartJobs).toHaveBeenCalledTimes(1)
    expect(mockLoadTemplates).toHaveBeenCalledTimes(1)
  })

  test('initPlugins', async () => {
    // Restart jobs error
    mockRestartJobs.mockImplementation(() => {
      throw new Error('restartJobs error')
    })
    await initPlugins()

    // Load error
    mockLoadPlugins.mockImplementation(() => {
      throw new Error('loadPlugins error')
    })
    await initPlugins()

    // Not needed
    //@ts-ignore
    global.tanatloc.plugins = true
    await initPlugins()
  })

  test('initTemplates', async () => {
    // Load error
    mockLoadTemplates.mockImplementation(() => {
      throw new Error('loadTemplates error')
    })
    await initTemplates()

    // Not needed
    //@ts-ignore
    global.tanatloc.templates = true
    await initTemplates()
  })
})
