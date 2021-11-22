import { useSimulation } from '../useSimulation'

const mockSimulation = jest.fn()
jest.mock('swr', () => () => ({
  data: { simulation: mockSimulation() },
  mutate: jest.fn()
}))

describe('api/simulation/useSimulation', () => {
  test('with simulation', () => {
    mockSimulation.mockImplementation(() => ({}))
    const [simulation, { mutateSimulation, loadingSimulation }] =
      //@ts-ignore
      useSimulation()
    expect(simulation).toEqual({})
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)

    mutateSimulation({ id: 'id' })
  })

  test('without simulation', () => {
    mockSimulation.mockImplementation(() => {
      // Empty
    })
    const [simulation, { mutateSimulation, loadingSimulation }] =
      //@ts-ignore
      useSimulation()
    expect(simulation).toEqual({
      id: '0'
    })
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })

  test('with id', () => {
    mockSimulation.mockImplementation(() => {
      // Empty
    })
    const [simulation, { mutateSimulation, loadingSimulation }] =
      useSimulation('id')
    expect(simulation).toEqual({ id: '0' })
    expect(mutateSimulation).toBeDefined()
    expect(loadingSimulation).toBe(false)
  })
})
