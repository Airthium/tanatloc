import Link from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/link', () => {
  test('exists', () => {
    expect(Link.add).toBeDefined()
    expect(Link.get).toBeDefined()
    expect(Link.del).toBeDefined()
  })
})
