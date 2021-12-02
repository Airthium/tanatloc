import Project from '..'

jest.mock('../useProjects', () => ({
  useProjects: jest.fn
}))

jest.mock('../useProject', () => ({
  useProject: jest.fn
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

jest.mock('../archive', () => ({
  archive: jest.fn
}))

describe('api/project', () => {
  test('import', () => {
    expect(Project.useProjects).toBeDefined()
    expect(Project.useProject).toBeDefined()
    expect(Project.add).toBeDefined()
    expect(Project.update).toBeDefined()
    expect(Project.del).toBeDefined()
    expect(Project.archive).toBeDefined()
  })
})
