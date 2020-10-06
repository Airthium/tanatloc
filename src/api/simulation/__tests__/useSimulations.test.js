import useSimulations from '../useSimulations'

let mockSimulations = () => [{ id: 'id' }, {}]
jest.mock('swr', () => () => ({
  data: { simulations: mockSimulations() },
  mutate: jest.fn()
}))

describe('src/api/simulation/useSimulations', () => {
  it('without ids', () => {
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

  it('with ids', () => {
    const [simulations] = useSimulations(['id1', 'id2'])
    expect(simulations).toEqual([{ id: 'id' }, {}])
  })

  it('withtout simulations', () => {
    mockSimulations = () => {}
    const [simulations] = useSimulations(['id1', 'id2'])
    expect(simulations).toEqual([])
  })
})
