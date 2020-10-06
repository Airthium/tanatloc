import useSimulation from '../useSimulation'

let mockSimulation
jest.mock('swr', () => () => ({
  data: { simulation: mockSimulation() },
  mutate: jest.fn()
}))

describe('src/api/simulation/useSimulation', () => {
  it('with simulation', () => {
    mockSimulation = () => ({})
    const [
      simulation,
      { mutateSimulation, loadingSimulation }
    ] = useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })

  it('without simulation', () => {
    mockSimulation = () => {}
    const [
      simulation,
      { mutateSimulation, loadingSimulation }
    ] = useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })

  it('with id', () => {
    mockSimulation = () => {}
    const [simulation, { mutateSimulation, loadingSimulation }] = useSimulation(
      'id'
    )
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })
})
