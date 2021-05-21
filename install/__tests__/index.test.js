import install from '../'

jest.mock('../dB', () => jest.fn())
jest.mock('../storage', () => jest.fn())

describe('install', () => {
  it('call', () => {
    expect(install).toBeDefined()
  })
})
