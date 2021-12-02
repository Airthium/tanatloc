import Organization from '..'

jest.mock('../useOrganizations', () => ({
  useOrganizations: jest.fn
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

describe('api/organization', () => {
  test('import', () => {
    expect(Organization.useOrganizations).toBeDefined()
    expect(Organization.add).toBeDefined()
    expect(Organization.update).toBeDefined()
    expect(Organization.del).toBeDefined()
  })
})
