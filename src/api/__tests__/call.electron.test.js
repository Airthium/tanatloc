import { fetcher } from '../call'

jest.mock('is-electron', () => () => true)

let mockRoute
global.fetch = async (route) => {
  mockRoute = route
  return {
    json: jest.fn()
  }
}

describe('src/api/call', () => {
  it('electron', () => {
    fetcher('/route')
    expect(mockRoute).toBe('http://localhost:3000/route')
  })
})
