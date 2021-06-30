import useSimulation from '../useSimulation'

const mockSimulation = jest.fn()
jest.mock('swr', () => () => ({
  data: { simulation: mockSimulation() },
  mutate: jest.fn()
}))

describe('api/simulation/useSimulation', () => {
  test('with simulation', () => {
    mockSimulation.mockImplementation(() => ({}))
    const [simulation, { mutateSimulation, loadingSimulation }] =
      useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)

    mutateSimulation({})
  })

  test('without simulation', () => {
    mockSimulation.mockImplementation(() => {})
    const [simulation, { mutateSimulation, loadingSimulation }] =
      useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })

  test('with id', () => {
    mockSimulation.mockImplementation(() => {})
    const [simulation, { mutateSimulation, loadingSimulation }] =
      useSimulation('id')
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })
})
