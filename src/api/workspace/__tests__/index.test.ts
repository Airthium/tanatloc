import Workspace from '..'

jest.mock('../useWorkspaces', () => ({
  useWorkspaces: jest.fn
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

describe('api/workspace', () => {
  test('import', () => {
    expect(Workspace.useWorkspaces).toBeDefined()
    expect(Workspace.add).toBeDefined()
    expect(Workspace.update).toBeDefined()
    expect(Workspace.del).toBeDefined()
  })
})
