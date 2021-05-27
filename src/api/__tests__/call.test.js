import Caller from '../call'

jest.mock('is-electron', () => () => false)

let mockRoute, mockParam
const mockOk = jest.fn(() => true)
const mockStatus = jest.fn(() => 200)
const mockJSON = jest.fn(async () => 'json')
const mockGet = jest.fn(() => '')
global.fetch = async (route, param) => {
  mockRoute = route
  mockParam = param
  return {
    ok: mockOk(),
    status: mockStatus(),
    json: mockJSON,
    headers: {
      get: () => mockGet()
    }
  }
}

describe('api/call', () => {
  test('fetcher', async () => {
    // Normal
    await Caller.fetcher('/route')
    expect(mockRoute).toBe('/route')

    // With payload
    await Caller.fetcher('/route', JSON.stringify({ payload: '' }))

    // Error
    mockOk.mockImplementation(() => false)
    try {
      await Caller.fetcher('/route')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('An error occured while fetching data.')
    }
  })

  test('call', async () => {
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

    // Wrong status
    try {
      mockStatus.mockImplementation(() => '500')
      mockGet.mockImplementation(() => 'something')
      await Caller.call('/route', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
