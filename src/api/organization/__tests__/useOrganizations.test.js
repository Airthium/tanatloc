import useOrganizations from '../useOrganizations'

const mockOrganizations = jest.fn()
jest.mock('swr', () => () => ({
  data: { organizations: mockOrganizations() },
  mutate: jest.fn()
}))

describe('api/organization/useOrganizations', () => {
  test('with organizations', () => {
    mockOrganizations.mockImplementation(() => [{ id: 'id' }])
    const [
      organizations,
      {
        addOneOrganization,
        mutateOneOrganization,
        delOneOrganization,
        loadingOrganizations
      }
    ] = useOrganizations()
    expect(organizations).toEqual([{ id: 'id' }])
    expect(addOneOrganization).toBeDefined()
    addOneOrganization({})
    expect(mutateOneOrganization).toBeDefined()
    mutateOneOrganization({})
    mutateOneOrganization({ id: 'id' })
    expect(delOneOrganization).toBeDefined()
    delOneOrganization({})
    delOneOrganization({ id: 'id' })
    expect(loadingOrganizations).toBe(false)
  })

  test('without organizations', () => {
    mockOrganizations.mockImplementation(() => {})
    const [organizations] = useOrganizations()
    expect(organizations).toEqual([])
  })
})
