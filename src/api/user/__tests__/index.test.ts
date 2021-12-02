import User from '..'

jest.mock('../useUser', () => ({
  useUser: jest.fn
}))

jest.mock('../useUsers', () => ({
  useUsers: jest.fn
}))

jest.mock('../add', () => ({
  add: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

jest.mock('../updateById', () => ({
  updateById: jest.fn
}))

jest.mock('../del', () => ({
  del: jest.fn
}))

jest.mock('../delById', () => ({
  delById: jest.fn
}))

describe('api/user', () => {
  test('import', () => {
    expect(User.useUser).toBeDefined()
    expect(User.useUsers).toBeDefined()
    expect(User.add).toBeDefined()
    expect(User.update).toBeDefined()
    expect(User.updateById).toBeDefined()
    expect(User.del).toBeDefined()
    expect(User.delById).toBeDefined()
  })
})
