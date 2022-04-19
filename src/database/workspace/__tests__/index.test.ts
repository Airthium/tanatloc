import Workspace from '..'

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

describe('src/database/group', () => {
  test('exists', () => {
    expect(Workspace.add).toBeDefined()
    expect(Workspace.get).toBeDefined()
    expect(Workspace.update).toBeDefined()
    expect(Workspace.del).toBeDefined()
  })
})
