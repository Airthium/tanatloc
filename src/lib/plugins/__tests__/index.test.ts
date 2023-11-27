import Plugins, { loadPlugins, restartJobs } from '..'

jest.mock('../../simulation', () => ({
  getAll: async () => [
    {
      id: 'id0'
    },
    {
      id: 'id1',
      tasks: [
        {
          status: 'finish'
        }
      ]
    },
    {
      id: 'id2',
      tasks: [
        {
          status: 'process',
          plugin: 'key1'
        }
      ]
    },
    {
      id: 'id3',
      scheme: {
        configuration: {
          run: {
            cloudServer: {
              configuration: {}
            }
          }
        }
      },
      tasks: [
        {
          status: 'process',
          plugin: 'key2'
        }
      ]
    },
    {
      id: 'id4',
      scheme: {
        configuration: {
          run: {}
        }
      },
      tasks: [
        {
          status: 'process',
          plugin: 'key2'
        }
      ]
    }
  ],
  update: async () => undefined
}))

jest.mock('../../tools', () => ({
  listDirectories: async () => ['plugin', 'pluginHPC', 'pluginerror']
}))

const mockElectron = jest.fn()
jest.mock('is-electron', () => () => mockElectron())

const mockPlugin = {
  category: 'HPC1',
  key: 'key1',
  server: {
    lib: {}
  },
  client: {
    configuration: {}
  }
}
jest.mock('../../../../plugins/plugin', () => mockPlugin, { virtual: true })
jest.mock('/plugins/plugin', () => mockPlugin, { virtual: true })

const mockPluginHPC = {
  category: 'HPC2',
  key: 'key2',
  server: {
    lib: {
      monitoring: jest.fn
    }
  },
  client: {
    configuration: {}
  }
}
jest.mock('../../../../plugins/pluginHPC', () => mockPluginHPC, {
  virtual: true
})
jest.mock('/plugins/pluginHPC', () => mockPluginHPC, { virtual: true })

jest.mock(
  '../../../../plugins/pluginerror',
  () => {
    throw new Error('plugin import error')
  },
  { virtual: true }
)
jest.mock(
  '/plugins/pluginerror',
  () => {
    throw new Error('plugin import error')
  },
  { virtual: true }
)

describe('src/lib/plugins', () => {
  beforeEach(() => {
    mockElectron.mockReset()

    Object.defineProperty(global, 'tanatloc', {
      value: {
        plugins: [
          {
            category: 'HPC1',
            key: 'key1',
            server: {
              lib: {}
            },
            client: {
              configuration: {}
            }
          },
          {
            category: 'HPC2',
            key: 'key2',
            server: {
              lib: {
                monitoring: jest.fn
              }
            },
            client: {
              configuration: {}
            }
          }
        ]
      },
      configurable: true
    })
  })

  test('loadPlugins', async () => {
    let plugins = await loadPlugins()
    expect(plugins).toEqual([
      {
        category: 'HPC1',
        key: 'key1',
        rootDirectory: 'plugin',
        server: {
          lib: {}
        },
        client: {
          configuration: {}
        }
      },
      {
        category: 'HPC2',
        key: 'key2',
        rootDirectory: 'pluginHPC',
        server: {
          lib: {
            monitoring: jest.fn
          }
        },
        client: {
          configuration: {}
        }
      }
    ])

    // Electron
    mockElectron.mockReturnValue(true)
    plugins = await loadPlugins()
    expect(plugins).toEqual([
      { rootDirectory: 'plugin' },
      { rootDirectory: 'pluginHPC' }
    ])
  })

  test('restartJobs', async () => {
    //@ts-ignore
    global.tanatloc.plugins[1].server.lib.monitoring = () => {
      throw new Error('monitoring error')
    }
    await restartJobs()
    //@ts-ignore
    global.tanatloc.plugins[1].server.lib.monitoring = jest.fn
  })

  test('serverList', async () => {
    let list = await Plugins.serverList()
    expect(list).toEqual([
      { category: 'HPC1', key: 'key1', lib: {} },
      { category: 'HPC2', key: 'key2', lib: { monitoring: jest.fn } }
    ])
  })

  test('clientList', async () => {
    // Authorized
    let list = await Plugins.clientList({ authorizedplugins: ['key1'] })
    expect(list).toEqual([{ category: 'HPC1', key: 'key1', configuration: {} }])

    // Unauthorized
    list = await Plugins.clientList({ authorizedplugins: [] })
    expect(list).toEqual([])

    // Complete
    list = await Plugins.clientList(undefined, true)
    expect(list).toEqual([
      { category: 'HPC1', key: 'key1', configuration: {} },
      { category: 'HPC2', key: 'key2', configuration: {} }
    ])
  })

  test('Empty', async () => {
    //@ts-ignore
    global.tanatloc.plugins = null
    const serverList = await Plugins.serverList()
    expect(serverList).toEqual([])

    const clientList = await Plugins.clientList({ authorizedplugins: ['key1'] })
    expect(clientList).toEqual([])
  })
})
