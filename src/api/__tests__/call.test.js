import Caller from '../call'

jest.mock('is-electron', () => () => false)

let mockRoute, mockParam
const mockJSON = jest.fn(async () => 'json')
const mockGet = jest.fn(() => '')
global.fetch = async (route, param) => {
  mockRoute = route
  mockParam = param
  return {
    json: mockJSON,
    headers: {
      get: () => mockGet()
    }
  }
}

describe('src/api/call', () => {
  it('fetcher', () => {
    Caller.fetcher('/route')
    expect(mockRoute).toBe('/route')
  })

  it('call', async () => {
    mockJSON.mockClear()

    await Caller.call('/route')
    expect(mockRoute).toBe('/route')
    expect(mockParam).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    await Caller.call('/route', {
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

    mockGet.mockImplementation(() => 'application/json')
    const res = await Caller.call('/route', {
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

    mockJSON.mockImplementation(() => ({
      error: {
        message: 'test'
      }
    }))
    try {
      await Caller.call('/route', {
        headers: {
          Accept: 'application/json'
        }
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
