import Plugin from '../plugin'

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('../user', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
}))

describe('src/lib/plugin', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockGet.mockImplementation(() => ({}))
    mockUpdate.mockReset()
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
    await Plugin.update({ id: 'id' }, [])
  })
})
