import Avatar from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/avatar', () => {
  test('exists', () => {
    expect(Avatar.add).toBeDefined()
    expect(Avatar.get).toBeDefined()
    expect(Avatar.del).toBeDefined()
  })
})
