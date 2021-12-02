import System from '..'

jest.mock('../useSystem', () => ({
  useSystem: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

describe('api/system', () => {
  test('import', () => {
    expect(System.useSystem).toBeDefined()
    expect(System.update).toBeDefined()
  })
})
