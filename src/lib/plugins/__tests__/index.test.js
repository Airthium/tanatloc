import Plugins from '..'

jest.mock('fs', () => ({
  promises: {
    readdir: async () => ['plugin']
  }
}))

jest.mock(
  '/plugins/plugin',
  () => ({
    category: 'category',
    key: 'key',
    server: {
      lib: 'lib'
    },
    client: {
      configuration: {}
    }
  }),
  { virtual: true }
)

describe('lib/plugins', () => {
  test('serverList', async () => {
    const list = await Plugins.serverList()
    expect(list).toEqual([{ category: 'category', key: 'key', lib: 'lib' }])
  })

  test('clientList', async () => {
    // Authorized
    let list = await Plugins.clientList({ authorizedplugins: ['key'] })
    expect(list).toEqual([
      { category: 'category', key: 'key', configuration: {} }
    ])

    // Unauthorized
    list = await Plugins.clientList({ authorizedplugins: [] })
    expect(list).toEqual([])
  })
})
