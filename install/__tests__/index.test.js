import install from '../'

jest.mock('../dB', () => () => {})
jest.mock('../storage', () => () => {})

describe('install', () => {
  it('call', () => {
    expect(install).toBeDefined()
  })
})
