import Group from '..'

jest.mock('../add', () => ({
  add: jest.fn
}))
jest.mock('../get', () => ({
  get: jest.fn
}))
jest.mock('../getAll', () => ({
  getAll: jest.fn
}))
jest.mock('../update', () => ({
  update: jest.fn
}))
jest.mock('../del', () => ({
  del: jest.fn
}))

describe('src/database/group', () => {
  test('exists', () => {
    expect(Group.add).toBeDefined()
    expect(Group.get).toBeDefined()
    expect(Group.getAll).toBeDefined()
    expect(Group.update).toBeDefined()
    expect(Group.del).toBeDefined()
  })
})
