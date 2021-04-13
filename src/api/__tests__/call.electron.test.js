import Caller from '../call'

jest.mock('is-electron', () => () => true)

let mockRoute
global.fetch = async (route) => {
  mockRoute = route
  return {
    json: jest.fn()
  }
}

describe('api/call', () => {
  it('electron', async () => {
    await Caller.fetcher('/route')
    expect(mockRoute).toBe('http://localhost:3000/route')
  })
})
