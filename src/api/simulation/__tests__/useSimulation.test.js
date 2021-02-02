import useSimulation from '../useSimulation'

const mockSimulation = jest.fn()
jest.mock('swr', () => () => ({
  data: { simulation: mockSimulation() },
  mutate: jest.fn()
}))

describe('src/api/simulation/useSimulation', () => {
  it('with simulation', () => {
    mockSimulation.mockImplementation(() => ({}))
    const [
      simulation,
      { mutateSimulation, loadingSimulation }
    ] = useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })

  it('without simulation', () => {
    mockSimulation.mockImplementation(() => {})
    const [
      simulation,
      { mutateSimulation, loadingSimulation }
    ] = useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })

  it('with id', () => {
    mockSimulation.mockImplementation(() => {})
    const [simulation, { mutateSimulation, loadingSimulation }] = useSimulation(
      'id'
    )
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })
})
