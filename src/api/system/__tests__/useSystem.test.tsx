import { render } from '@testing-library/react'

import { useSystem } from '../useSystem'

const mockData = jest.fn()
jest.mock('swr', () => () => mockData())

let data: any
const FunctionalComponent = () => {
  const [system, { mutateSystem, loadingSystem }] = useSystem()

  data = {
    system,
    swr: { mutateSystem, loadingSystem }
  }

  return null
}

describe('api/system/useSystem', () => {
  beforeEach(() => {
    mockData.mockImplementation(() => ({
      data: { system: undefined },
      mutate: jest.fn
    }))
  })

  test('with data', () => {
    mockData.mockImplementation(() => ({
      data: { system: { item: 'item' } },
      mutate: jest.fn
    }))

    render(<FunctionalComponent />)

    expect(data.system).toEqual({ item: 'item' })
    expect(data.swr.mutateSystem).toBeDefined()
    expect(data.swr.loadingSystem).toBe(false)

    data.swr.mutateSystem({})
  })

  test('without data', () => {
    mockData.mockImplementation(() => ({
      mutate: jest.fn
    }))

    render(<FunctionalComponent />)

    expect(data.system).toEqual({})
  })
})
