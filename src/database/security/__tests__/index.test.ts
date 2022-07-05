import System from '..'

jest.mock('../get', () => ({
  get: jest.fn
}))

describe('database/security', () => {
  test('import', () => {
    expect(System.get).toBeDefined()
  })
})
