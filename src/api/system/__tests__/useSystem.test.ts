import { useSystem } from '../useSystem'

const mockData = jest.fn()
jest.mock('swr', () => () => mockData())

describe('api/system/useSystem', () => {
  beforeEach(() => {
    mockData.mockImplementation(() => ({
      data: { system: undefined },
      mutate: jest.fn
    }))
  })

  test('with data', () => {
    mockData.mockImplementation(() => ({
      data: { system: { item: 'item' } },
      mutate: jest.fn
    }))
    const [system, { mutateSystem, loadingSystem }] = useSystem()
    expect(system).toEqual({ item: 'item' })
    expect(mutateSystem).toBeDefined()
    expect(loadingSystem).toBe(false)

    mutateSystem({})
  })

  test('without data', () => {
    mockData.mockImplementation(() => ({
      mutate: jest.fn
    }))
    const [system] = useSystem()
    expect(system).toEqual(undefined)
  })
})
