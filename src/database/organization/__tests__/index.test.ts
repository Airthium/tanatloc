import Organization from '..'

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

describe('src/database/organization', () => {
  test('exists', () => {
    expect(Organization.add).toBeDefined()
    expect(Organization.get).toBeDefined()
    expect(Organization.getAll).toBeDefined()
    expect(Organization.update).toBeDefined()
    expect(Organization.del).toBeDefined()
  })
})
