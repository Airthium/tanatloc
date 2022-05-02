import Plugin from '../'

jest.mock('uuid', () => ({
  v4: () => 'uuid'
}))

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
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

describe('lib/plugin', () => {
  beforeEach(() => {
    mockInit.mockReset()

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({}))
    mockUpdate.mockReset()
  })

  test('add', async () => {
    // Normal
    await Plugin.add({ id: 'id' }, {})
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    mockGet.mockImplementation(() => ({ plugins: [{}] }))

    // Init (without API)
    await Plugin.add({ id: 'id' }, { key: 'nokey', needInit: true })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockInit).toHaveBeenCalledTimes(0)

    // Init (with API)
    await Plugin.add({ id: 'id' }, { key: 'key', needInit: true })
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockInit).toHaveBeenCalledTimes(1)

    // Name
    await Plugin.add(
      { id: 'id' },
      {
        key: 'key',
        configuration: { name: { label: 'name', type: 'type', value: 'name' } }
      }
    )
  })

  test('getByUser', async () => {
    let plugins

    plugins = await Plugin.getByUser({ id: 'id' })
    expect(plugins).toEqual([])

    mockGet.mockImplementation(() => ({ plugins: [{}] }))
    plugins = await Plugin.getByUser({ id: 'id' })
    expect(plugins).toEqual([{}])
  })

  test('update', async () => {
    // No plugins
    await Plugin.update({ id: 'id' }, { uuid: 'uuid' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)

    // Normal
    mockGet.mockImplementation(() => ({ plugins: [{ uuid: 'uuid' }] }))
    await Plugin.update({ id: 'id' }, { uuid: 'uuid' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Re-init
    mockGet.mockImplementation(() => ({
      plugins: [{ uuid: 'uuid' }]
    }))
    await Plugin.update(
      { id: 'id' },
      { key: 'nokey', uuid: 'uuid', needInit: true, needReInit: true }
    )
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    await Plugin.update(
      { id: 'id' },
      { key: 'key', uuid: 'uuid', needInit: true, needReInit: true }
    )
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(3)

    // Not found
    await Plugin.update(
      { id: 'id' },
      { uuid: 'nouuid', needInit: true, needReInit: true }
    )
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(3)

    // Name
    await Plugin.update(
      { id: 'id' },
      {
        uuid: 'uuid',
        configuration: { name: { label: 'name', type: 'type', value: 'name' } }
      }
    )
  })

  test('del', async () => {
    // No plugins
    await Plugin.del({ id: 'id' }, { uuid: 'uuid' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)

    // Normal
    mockGet.mockImplementation(() => ({ plugins: [{ uuid: 'uuid' }] }))
    await Plugin.del({ id: 'id' }, { uuid: 'uuid' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Not found
    await Plugin.del({ id: 'id' }, { uuid: 'nouuid' })
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
