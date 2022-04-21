import { render } from '@testing-library/react'

import { useSimulations } from '../useSimulations'

const mockSimulations = jest.fn()
jest.mock('swr', () => () => ({
  data: { simulations: mockSimulations() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = ({ ids }: { ids?: string[] }) => {
  const [
    simulations,
    {
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      loadingSimulations
    }
  ] = useSimulations(ids)

  data = {
    simulations,
    swr: {
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      loadingSimulations
    }
  }

  return null
}

describe('api/simulation/useSimulations', () => {
  beforeEach(() => {
    mockSimulations.mockImplementation(() => [{ id: 'id' }, {}])
  })

  test('without ids', () => {
    render(<FunctionalComponent />)

    expect(data.simulations).toEqual([{ id: 'id' }, {}])
    expect(data.swr.addOneSimulation).toBeDefined()
    expect(data.swr.delOneSimulation).toBeDefined()
    expect(data.swr.mutateOneSimulation).toBeDefined()
    expect(data.swr.loadingSimulations).toBe(false)

    data.swr.addOneSimulation({ id: 'id' })
    data.swr.delOneSimulation({ id: 'id' })
    data.swr.mutateOneSimulation({ id: 'id' })
  })

  test('with ids', () => {
    render(<FunctionalComponent ids={['id1', 'id2']} />)

    expect(data.simulations).toEqual([{ id: 'id' }, {}])
  })

  test('withtout simulations', () => {
    mockSimulations.mockImplementation(() => {
      // Empty
    })

    render(<FunctionalComponent ids={['id1', 'id2']} />)

    expect(data.simulations).toEqual([])
  })
})
