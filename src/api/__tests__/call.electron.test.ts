import { fetcher } from '../call'

jest.mock('is-electron', () => () => true)

const mockOk = jest.fn(() => true)
let mockRoute: string
Object.defineProperty(global, 'fetch', {
  value: async (route: string) => {
    mockRoute = route
    return {
      ok: mockOk(),
      json: jest.fn(),
      headers: {
        get: () => {
          // Empty
        }
      }
    }
  }
})

describe('api/call', () => {
  test('electron', async () => {
    // Normal
    await fetcher('/route')
    expect(mockRoute).toBe('http://localhost:3000/route')

    // Error
    mockOk.mockImplementation(() => false)
    try {
      await fetcher('/route')
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('An error occured while fetching data.')
    }
  })
})
