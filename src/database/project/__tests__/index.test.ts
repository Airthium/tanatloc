import Project from '..'

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

describe('src/database/project', () => {
  test('exists', () => {
    expect(Project.add).toBeDefined()
    expect(Project.get).toBeDefined()
    expect(Project.update).toBeDefined()
    expect(Project.del).toBeDefined()
  })
})
