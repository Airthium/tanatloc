import { render } from '@testing-library/react'

import { useSimulation } from '../useSimulation'

const mockSimulation = jest.fn()
jest.mock('swr', () => () => ({
  data: { simulation: mockSimulation() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = ({ id }: { id?: string }) => {
  const [simulation, { mutateSimulation, loadingSimulation }] =
    useSimulation(id)

  data = {
    simulation,
    swr: { mutateSimulation, loadingSimulation }
  }

  return null
}

describe('api/simulation/useSimulation', () => {
  test('with simulation', () => {
    mockSimulation.mockImplementation(() => ({}))

    render(<FunctionalComponent />)

    expect(data.simulation).toEqual({})
    expect(data.swr.mutateSimulation).toBeDefined()
    expect(data.swr.loadingSimulation).toBe(false)

    data.swr.mutateSimulation({ id: 'id' })
  })

  test('without simulation', () => {
    mockSimulation.mockImplementation(() => {
      // Empty
    })

    render(<FunctionalComponent />)

    expect(data.simulation).toEqual({
      id: '0'
    })
    expect(data.swr.mutateSimulation).toBeDefined()
    expect(data.swr.loadingSimulation).toBe(false)
  })

  test('with id', () => {
    mockSimulation.mockImplementation(() => {
      // Empty
    })

    render(<FunctionalComponent id="id" />)

    expect(data.simulation).toEqual({ id: '0' })
    expect(data.swr.mutateSimulation).toBeDefined()
    expect(data.swr.loadingSimulation).toBe(false)
  })
})
