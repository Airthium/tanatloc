import { call, fetcher } from '../call'

jest.mock('is-electron', () => () => false)

let mockRoute: string, mockParam: any
const mockOk = jest.fn(() => true)
const mockStatus = jest.fn(() => 200)
const mockJSON = jest.fn(async () => ({}))
const mockGet = jest.fn(() => '')
Object.defineProperty(global, 'fetch', {
  value: async (route: string, param: any) => {
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
})

describe('api/call', () => {
  test('fetcher', async () => {
    // Normal
    await fetcher('/route')
    expect(mockRoute).toBe('/route')

    // With payload
    await fetcher('/route', JSON.stringify({ payload: '' }))

    // Error
    mockOk.mockImplementation(() => false)
    try {
      await fetcher('/route')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('An error occured while fetching data.')
    }
  })

  test('call', async () => {
    mockJSON.mockClear()

    // Non ok, no params
    mockOk.mockImplementation(() => false)
    mockStatus.mockImplementation(() => 500)
    try {
      await call('/route')
      expect(true).toBe(false)
    } catch (err) {
      expect(mockRoute).toBe('/route')
      expect(mockParam).toEqual({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      expect(err.message).toBe('An error occured while fetching data.')
      expect(err.info).toBe(false)
      expect(err.status).toBe(500)
    }

    // Non ok, params, json
    mockGet.mockImplementation(() => 'application/json')
    mockJSON.mockImplementation(async () => ({
      error: true,
      message: 'message'
    }))
    try {
      await call('/route', {
        method: 'TEST',
        headers: {
          Accept: 'application/json'
        },
        body: 'something'
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(mockParam).toEqual({
        method: 'TEST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: 'something'
      })
      expect(err.message).toBe('An error occured while fetching data.')
      expect(err.info).toEqual({ error: true, message: 'message' })
      expect(err.status).toBe(500)
    }

    // Ok, json
    mockOk.mockImplementation(() => true)
    mockStatus.mockImplementation(() => 200)
    mockJSON.mockImplementation(async () => ({ ok: true }))
    let res = await call('/route', {
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
    expect(res.status).toBe(200)

    // Ok
    mockGet.mockImplementation(() => '')
    res = await call('/route', {
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
    expect(res.status).toBe(200)
  })
})
