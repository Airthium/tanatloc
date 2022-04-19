import User from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../getAll', () => ({
  getAll: jest.fn
}))
jest.mock('../getByUsernameAndPassword', () => ({
  getByUsernameAndPassword: jest.fn
}))
jest.mock('../update', () => ({
  update: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/group', () => {
  test('exists', () => {
    expect(User.add).toBeDefined()
    expect(User.get).toBeDefined()
    expect(User.getAll).toBeDefined()
    expect(User.getByUsernameAndPassword).toBeDefined()
    expect(User.update).toBeDefined()
    expect(User.del).toBeDefined()
  })
})
