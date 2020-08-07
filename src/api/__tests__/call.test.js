import { fetcher, call } from '../call'

jest.mock('is-electron', () => () => false)

let mockRoute, mockParam
const mockJSON = jest.fn(async () => 'json')
global.fetch = async (route, param) => {
  mockRoute = route
  mockParam = param
  return {
    json: mockJSON
  }
}

describe('src/api/call', () => {
  it('fetcher', () => {
    fetcher('/route')
    expect(mockRoute).toBe('/route')
  })

  it('call', async () => {
    mockJSON.mockClear()

    await call('/route')
    expect(mockRoute).toBe('/route')
    expect(mockParam).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    await call('/route', {
      method: 'TEST',
      headers: {
        'Test-Header': 'Test-Header'
      },
      body: 'something'
    })
    expect(mockParam).toEqual({
      method: 'TEST',
      headers: {
        'Content-Type': 'application/json',
        'Test-Header': 'Test-Header'
      },
      body: 'something'
    })

    const res = await call('/route', {
      headers: {
        Accept: 'application/json'
      }
    })
    expect(mockParam).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    expect(mockJSON).toHaveBeenCalledTimes(1)
    expect(res).toBe('json')
  })
})
