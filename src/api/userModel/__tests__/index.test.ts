import UserModel from '..'

jest.mock('../add', () => ({ add: jest.fn }))

jest.mock('../update', () => ({ update: jest.fn }))

jest.mock('../del', () => ({ del: jest.fn }))

describe('api/userModel', () => {
  test('import', () => {
    expect(UserModel.add).toBeDefined()
    expect(UserModel.update).toBeDefined()
    expect(UserModel.del).toBeDefined()
  })
})
