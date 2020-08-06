import { fetcher } from '../call'

jest.mock('is-electron', () => () => false)

let mockRoute
global.fetch = async (route) => {
  mockRoute = route
  return {
    json: jest.fn()
  }
}

describe('src/api/call', () => {
  it('no electron', () => {
    fetcher('/route')
    expect(mockRoute).toBe('/route')
  })
})
