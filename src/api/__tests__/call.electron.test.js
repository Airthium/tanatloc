import Caller from '../call'

jest.mock('is-electron', () => () => true)

const mockOk = jest.fn(() => true)
let mockRoute
global.fetch = async (route) => {
  mockRoute = route
  return {
    ok: mockOk(),
    json: jest.fn()
  }
}

describe('api/call', () => {
  it('electron', async () => {
    // Normal
    await Caller.fetcher('/route')
    expect(mockRoute).toBe('http://localhost:3000/route')

    // Error
    mockOk.mockImplementation(() => false)
    try {
      await Caller.fetcher('/route')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('An error occured while fetching data.')
    }
  })
})
