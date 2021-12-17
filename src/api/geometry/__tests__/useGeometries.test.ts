import { useGeometries } from '../useGeometries'

const mockData = jest.fn()
jest.mock('swr', () => () => mockData())

describe('api/geometry/useGeometries', () => {
  beforeEach(() => {
    mockData.mockImplementation(() => ({
      data: { geometries: [{ id: 'id' }, {}] },
      mutate: jest.fn
    }))
  })

  test('withoud data', () => {
    mockData.mockImplementation(() => ({
      mutate: jest.fn
    }))
    const [geometries] = useGeometries(['id1', 'id2'])
    expect(geometries).toEqual([])
  })

  test('without geometries', () => {
    mockData.mockImplementation(() => ({
      data: { geometries: undefined },
      mutate: jest.fn
    }))
    const [geometries] = useGeometries(['id1', 'id2'])
    expect(geometries).toEqual([])
  })

  test('with geometries', () => {
    const [
      geometries,
      {
        mutateGeometries,
        addOneGeometry,
        delOneGeometry,
        mutateOneGeometry,
        loadingGeometries
      }
    ] = useGeometries()
    expect(geometries).toEqual([{ id: 'id' }, {}])
    expect(mutateGeometries).toBeDefined()
    expect(addOneGeometry).toBeDefined()
    expect(delOneGeometry).toBeDefined()
    expect(mutateOneGeometry).toBeDefined()
    expect(loadingGeometries).toBe(false)

    addOneGeometry({ id: 'id' })
    delOneGeometry({ id: 'id' })
    mutateOneGeometry({ id: 'id' })
  })
})
