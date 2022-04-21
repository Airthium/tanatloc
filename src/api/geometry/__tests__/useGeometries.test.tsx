import { render } from '@testing-library/react'

import { useGeometries } from '../useGeometries'

const mockData = jest.fn()
jest.mock('swr', () => () => mockData())

let data: any
const FunctionalComponent = ({ ids }: { ids?: string[] }) => {
  const [
    geometries,
    { addOneGeometry, delOneGeometry, mutateOneGeometry, loadingGeometries }
  ] = useGeometries(ids)

  data = {
    geometries,
    swr: {
      addOneGeometry,
      delOneGeometry,
      mutateOneGeometry,
      loadingGeometries
    }
  }

  return null
}

describe('api/geometry/useGeometries', () => {
  beforeEach(() => {
    data = null

    mockData.mockImplementation(() => ({
      data: { geometries: [{ id: 'id' }, {}] },
      mutate: jest.fn
    }))
  })

  test('withoud data', () => {
    mockData.mockImplementation(() => ({
      mutate: jest.fn
    }))

    render(<FunctionalComponent />)
    expect(data.geometries).toEqual([])
  })

  test('without geometries', () => {
    mockData.mockImplementation(() => ({
      data: { geometries: undefined },
      mutate: jest.fn
    }))

    render(<FunctionalComponent ids={['id1', 'id2']} />)
    expect(data.geometries).toEqual([])
  })

  test('with geometries', () => {
    render(<FunctionalComponent ids={['id1', 'id2']} />)

    expect(data.geometries).toEqual([{ id: 'id' }, {}])
    expect(data.swr.addOneGeometry).toBeDefined()
    expect(data.swr.delOneGeometry).toBeDefined()
    expect(data.swr.mutateOneGeometry).toBeDefined()
    expect(data.swr.loadingGeometries).toBe(false)

    data.swr.addOneGeometry({ id: 'id' })
    data.swr.delOneGeometry({ id: 'id' })
    data.swr.mutateOneGeometry({ id: 'id' })
  })
})
