import install from '../'

jest.mock('../dB', () => () => {})

describe('install', () => {
  it('call', () => {
    expect(install).toBeDefined()
  })
})
