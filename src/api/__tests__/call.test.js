import call from '../call'

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
    call('/route')
    expect(mockRoute).toBe('/route')
  })
})
