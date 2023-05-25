import UserModel from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../update', () => ({
  update: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/avatar', () => {
  test('exists', () => {
    expect(UserModel.add).toBeDefined()
    expect(UserModel.get).toBeDefined()
    expect(UserModel.update).toBeDefined()
    expect(UserModel.del).toBeDefined()
  })
})
