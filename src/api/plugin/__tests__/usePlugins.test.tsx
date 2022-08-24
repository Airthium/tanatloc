import { render } from '@testing-library/react'

import { usePlugins } from '../usePlugins'

const mockData = jest.fn()
jest.mock('swr', () => () => ({
  data: mockData(),
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = () => {
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

  data = {
    plugins,
    swr: {
      mutatePlugins,
      addOnePlugin,
      delOnePlugin,
      mutateOnePlugin,
      loadingPlugins
    }
  }

  return null
}

describe('api/plugins/usePlugins', () => {
  beforeEach(() => {
    mockData.mockImplementation(() => ({
      plugins: [{ key: 'key' }, {}]
    }))
  })

  test('with plugins', () => {
    render(<FunctionalComponent />)

    expect(data.plugins).toEqual([{ key: 'key' }, {}])
    expect(data.swr.mutatePlugins).toBeDefined()
    expect(data.swr.addOnePlugin).toBeDefined()
    expect(data.swr.delOnePlugin).toBeDefined()
    expect(data.swr.mutateOnePlugin).toBeDefined()
    expect(data.swr.loadingPlugins).toBe(false)

    data.swr.addOnePlugin({ key: 'key' })
    data.swr.delOnePlugin({ key: 'key' })
    data.swr.mutateOnePlugin({ key: 'key' })
  })

  test('withtout plugins', () => {
    mockData.mockImplementation(() => undefined)

    render(<FunctionalComponent />)

    expect(data.plugins).toEqual([])
    expect(data.swr.loadingPlugins).toBe(true)
  })
})
