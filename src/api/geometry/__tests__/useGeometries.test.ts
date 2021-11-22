import { useGeometries } from '../useGeometries'

const mockGeometries = jest.fn()
jest.mock('swr', () => () => ({
  data: { geometries: mockGeometries() },
  mutate: jest.fn()
}))

describe('api/geometry/useGeometries', () => {
  beforeEach(() => {
    mockGeometries.mockImplementation(() => [{ id: 'id' }, {}])
  })

  test('without ids', () => {
    const [
      geometries,
      {
        mutateGeometries,
        addOneGeometry,
        delOneGeometry,
        mutateOneGeometry,
        loadingGeometries
      }
    ] =
      //@ts-ignore
      useGeometries()
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

  test('with ids', () => {
    const [geometries] = useGeometries(['id1', 'id2'])
    expect(geometries).toEqual([{ id: 'id' }, {}])
  })

  test('withtout geometries', () => {
    mockGeometries.mockImplementation(() => {})
    const [geometries] = useGeometries(['id1', 'id2'])
    expect(geometries).toEqual([])
  })
})
