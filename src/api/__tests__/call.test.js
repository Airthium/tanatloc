import call from '../call'

let mockReturn = () => true
jest.mock('is-electron', () => {
  return () => mockReturn()
})

let mockRoute, mockParameters
global.fetch = (route, parameters) => {
  mockRoute = route
  mockParameters = parameters
  return {
    json: jest.fn()
  }
}

describe('lib/api/call', () => {
  it('electron', async () => {
    await call('route', {})
    expect(mockRoute).toBe('http://localhost:3000/route')
    expect(mockParameters).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('not electron', async () => {
    mockReturn = () => false
    await call('route', {})
    expect(mockRoute).toBe('route')
    expect(mockParameters).toEqual({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
})
