import { useSimulations } from '../useSimulations'

const mockSimulations = jest.fn()
jest.mock('swr', () => () => ({
  data: { simulations: mockSimulations() },
  mutate: jest.fn()
}))

describe('api/simulation/useSimulations', () => {
  beforeEach(() => {
    mockSimulations.mockImplementation(() => [{ id: 'id' }, {}])
  })

  test('without ids', () => {
    const [
      simulations,
      {
        mutateSimulations,
        addOneSimulation,
        delOneSimulation,
        mutateOneSimulation,
        loadingSimulations
      }
    ] = useSimulations()
    expect(simulations).toEqual([{ id: 'id' }, {}])
    expect(mutateSimulations).toBeDefined()
    expect(addOneSimulation).toBeDefined()
    expect(delOneSimulation).toBeDefined()
    expect(mutateOneSimulation).toBeDefined()
    expect(loadingSimulations).toBe(false)

    addOneSimulation({ id: 'id' })
    delOneSimulation({ id: 'id' })
    mutateOneSimulation({ id: 'id' })
  })

  test('with ids', () => {
    const [simulations] = useSimulations(['id1', 'id2'])
    expect(simulations).toEqual([{ id: 'id' }, {}])
  })

  test('withtout simulations', () => {
    mockSimulations.mockImplementation(() => {})
    const [simulations] = useSimulations(['id1', 'id2'])
    expect(simulations).toEqual([])
  })
})
