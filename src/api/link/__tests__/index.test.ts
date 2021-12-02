import Link from '..'

jest.mock('../get', () => ({
  get: jest.fn
}))

jest.mock('../process', () => ({
  process: jest.fn
}))

describe('api/link', () => {
  test('import', () => {
    expect(Link.get).toBeDefined()
    expect(Link.process).toBeDefined()
  })
})
