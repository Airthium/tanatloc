import Plugins from '..'

jest.mock('fs', () => ({
  promises: {
    readdir: async () => ['plugin', 'pluginHPC', 'pluginerror']
  }
}))

jest.mock('is-electron', () => () => false)

jest.mock(
  '/plugins/plugin',
  () => ({
    category: 'HPC1',
    key: 'key1',
    server: {
      lib: {}
    },
    client: {
      configuration: {}
    }
  }),
  { virtual: true }
)

jest.mock(
  '/plugins/pluginHPC',
  () => ({
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
  }),
  { virtual: true }
)

jest.mock(
  '/plugins/pluginerror',
  () => {
    throw new Error('plugin import error')
  },
  { virtual: true }
)

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
  ]
}))

describe('lib/plugins', () => {
  test('serverList', async () => {
    const list = await Plugins.serverList()
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
    list = await Plugins.clientList(null, true)
    expect(list).toEqual([
      { category: 'HPC1', key: 'key1', configuration: {} },
      { category: 'HPC2', key: 'key2', configuration: {} }
    ])
  })
})
