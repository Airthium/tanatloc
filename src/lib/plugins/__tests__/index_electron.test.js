Object.defineProperty(process, 'resourcesPath', { value: 'resourcesPath' })

jest.mock('fs', () => ({
  promises: {
    readdir: async () => ['plugin', 'pluginerror']
  }
}))

jest.mock('is-electron', () => () => true)

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
  test('load', async () => {
    require('..')
  })
})
