import Plugins from '..'

jest.mock('fs', () => ({
  promises: {
    readdir: async () => ['plugin', 'pluginerror']
  }
}))

jest.mock('is-electron', () => () => false)

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

jest.mock(
  '/plugins/pluginerror',
  () => {
    throw new Error('plugin import error')
  },
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

    // Complete
    list = await Plugins.clientList(null, true)
    expect(list).toEqual([
      { category: 'category', key: 'key', configuration: {} }
    ])
  })
})
