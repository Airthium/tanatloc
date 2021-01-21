import Plugin from '../plugin'

const mockInit = jest.fn()
jest.mock('@/plugin/api', () => ({
  key: {
    init: () => mockInit()
  }
}))

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('../user', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
}))

describe('src/lib/plugin', () => {
  beforeEach(() => {
    mockInit.mockReset()

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({}))
    mockUpdate.mockReset()
  })

  it('add', async () => {
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
  })

  it('getByUser', async () => {
    let plugins

    plugins = await Plugin.getByUser({ id: 'id' })
    expect(plugins).toEqual([])

    mockGet.mockImplementation(() => ({ plugins: [{}] }))
    plugins = await Plugin.getByUser({ id: 'id' })
    expect(plugins).toEqual([{}])
  })

  it('update', async () => {
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
      { key: 'nokey', uuid: 'uuid', needReInit: true }
    )
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    await Plugin.update(
      { id: 'id' },
      { key: 'key', uuid: 'uuid', needReInit: true }
    )
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(3)

    // Not found
    await Plugin.update({ id: 'id' }, { uuid: 'nouuid', needReInit: true })
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
  })

  it('del', async () => {
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
