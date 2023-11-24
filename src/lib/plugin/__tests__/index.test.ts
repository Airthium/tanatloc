import Plugin from '../'

jest.mock('uuid', () => ({
  v4: () => 'uuid'
}))

const mockUserGet = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockUserGet(),
  update: async () => mockUserUpdate()
}))

const mockInit = jest.fn()
jest.mock('../../plugins', () => ({
  serverList: () => [
    {
      key: 'key',
      lib: {
        init: () => mockInit()
      }
    }
  ]
}))

jest.mock('../../tools', () => ({
  encrypt: async (str: string) => '[MOCK ENCRYPTED]' + str
}))

describe('lib/plugin', () => {
  beforeEach(() => {
    mockInit.mockReset()

    mockUserGet.mockReset()
    mockUserGet.mockImplementation(() => ({}))
    mockUserUpdate.mockReset()
  })

  test('add', async () => {
    // Normal
    await Plugin.add({ id: 'id' }, {})
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    mockUserGet.mockImplementation(() => ({ plugins: [{}] }))

    // Init (without API)
    await Plugin.add({ id: 'id' }, { key: 'nokey', haveInit: true })
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockInit).toHaveBeenCalledTimes(0)

    // Init (with API)
    await Plugin.add({ id: 'id' }, { key: 'key', haveInit: true })
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockInit).toHaveBeenCalledTimes(1)

    // Name & secret
    await Plugin.add(
      { id: 'id' },
      {
        key: 'key',
        configuration: {
          name: { label: 'name', type: 'type', value: 'name' },
          secret: {
            secret: true,
            value: 'secret'
          }
        }
      }
    )

    // No user
    mockUserGet.mockImplementation(() => undefined)
    await Plugin.add({ id: 'id' }, {})
  })

  test('extra', async () => {
    // Normal
    await Plugin.extra({ key: 'key' }, 'reload')

    // Not found
    await Plugin.extra({ key: 'otherkey' }, 'reload')
  })

  test('getByUser', async () => {
    let plugins

    plugins = await Plugin.getByUser({ id: 'id' })
    expect(plugins).toEqual([])

    mockUserGet.mockImplementation(() => ({ plugins: [{}] }))
    plugins = await Plugin.getByUser({ id: 'id' })
    expect(plugins).toEqual([{}])
  })

  test('update', async () => {
    // No user
    mockUserGet.mockImplementation(() => undefined)
    await Plugin.update(
      { id: 'id' },
      { uuid: 'uuid', configuration: { name: { value: 'name' } } }
    )
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)

    // Normal
    mockUserGet.mockImplementation(() => ({ plugins: [{ uuid: 'uuid' }] }))
    await Plugin.update({ id: 'id' }, { uuid: 'uuid' })
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    // No plugin
    mockUserGet.mockImplementation(() => ({}))
    await Plugin.update({ id: 'id' }, { uuid: 'uuid' })
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    // Pplugin not found
    mockUserGet.mockImplementation(() => ({ plugins: [{ uuid: 'uuid' }] }))
    await Plugin.update({ id: 'id' }, { uuid: 'nouuid' })
    expect(mockUserGet).toHaveBeenCalledTimes(4)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    // Re-init
    mockUserGet.mockImplementation(() => ({
      plugins: [
        {
          uuid: 'uuid',
          configuration: {
            secret: { secret: true, value: 'secret' },
            nosecret: {}
          }
        }
      ]
    }))
    await Plugin.update(
      { id: 'id' },
      { key: 'nokey', uuid: 'uuid', haveInit: true, needReInit: true }
    )
    expect(mockUserGet).toHaveBeenCalledTimes(5)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)

    // Re-init with lib
    mockUserGet.mockImplementation(() => ({
      plugins: [
        {
          uuid: 'uuid',
          configuration: {
            secret: { secret: true, value: 'secret' },
            nosecret: {}
          }
        }
      ]
    }))
    await Plugin.update(
      { id: 'id' },
      { key: 'key', uuid: 'uuid', haveInit: true, needReInit: true }
    )
    expect(mockUserGet).toHaveBeenCalledTimes(6)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
  })

  test('del', async () => {
    // No plugins
    await Plugin.del({ id: 'id' }, { uuid: 'uuid' })
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)

    // Normal
    mockUserGet.mockImplementation(() => ({ plugins: [{ uuid: 'uuid' }] }))
    await Plugin.del({ id: 'id' }, { uuid: 'uuid' })
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    // Not found
    await Plugin.del({ id: 'id' }, { uuid: 'nouuid' })
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)

    // No user
    mockUserGet.mockImplementation(() => undefined)
    await Plugin.del({ id: 'id' }, { uuid: 'uuid' })
  })
})
