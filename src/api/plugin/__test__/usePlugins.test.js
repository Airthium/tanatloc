import usePlugins from '../usePlugins'

const mockData = jest.fn(() => ({
  plugins: [{ key: 'key' }, {}]
}))
jest.mock('swr', () => () => ({
  data: mockData(),
  mutate: jest.fn()
}))

describe('api/plugins/usePlugins', () => {
  test('with plugins', () => {
    const [
      plugins,
      {
        mutatePlugins,
        addOnePlugin,
        delOnePlugin,
        mutateOnePlugin,
        loadingPlugins
      }
    ] = usePlugins()

    expect(plugins).toEqual([{ key: 'key' }, {}])
    expect(mutatePlugins).toBeDefined()
    expect(addOnePlugin).toBeDefined()
    expect(delOnePlugin).toBeDefined()
    expect(mutateOnePlugin).toBeDefined()
    expect(loadingPlugins).toBe(false)

    addOnePlugin({ key: 'key' })
    delOnePlugin({ key: 'key' })
    mutateOnePlugin({ key: 'key' })
  })

  test('withtout plugins', () => {
    mockData.mockImplementation(() => undefined)
    const [plugins, { loadingPlugins }] = usePlugins()
    expect(plugins).toEqual([])
    expect(loadingPlugins).toBe(true)
  })
})
