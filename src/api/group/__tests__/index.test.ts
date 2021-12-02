import Group from '..'

jest.mock('../useGroups', () => ({
  useGroups: jest.fn
}))

jest.mock('../add', () => ({
  add: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

jest.mock('../del', () => ({
  del: jest.fn
}))

describe('api/group', () => {
  test('import', () => {
    expect(Group.useGroups).toBeDefined()
    expect(Group.add).toBeDefined()
    expect(Group.update).toBeDefined()
    expect(Group.del).toBeDefined()
  })
})
