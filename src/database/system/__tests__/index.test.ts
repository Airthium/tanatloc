import System from '..'

jest.mock('../get', () => ({
  get: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

describe('database/system', () => {
  test('import', () => {
    expect(System.get).toBeDefined()
    expect(System.update).toBeDefined()
  })
})
