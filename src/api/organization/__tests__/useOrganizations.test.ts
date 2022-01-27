import { useOrganizations } from '../useOrganizations'

const mockOrganizations = jest.fn()
jest.mock('swr', () => () => ({
  data: { organizations: mockOrganizations() },
  mutate: jest.fn()
}))

describe('api/organization/useOrganizations', () => {
  test('with organizations', () => {
    mockOrganizations.mockImplementation(() => [{ id: 'id' }, { id: 'id1' }])
    const [
      organizations,
      {
        addOneOrganization,
        mutateOneOrganization,
        delOneOrganization,
        loadingOrganizations
      }
    ] = useOrganizations()
    expect(organizations).toEqual([{ id: 'id' }, { id: 'id1' }])
    expect(addOneOrganization).toBeDefined()
    addOneOrganization({ id: 'id' })
    expect(mutateOneOrganization).toBeDefined()
    mutateOneOrganization({ id: 'id' })
    mutateOneOrganization({ id: 'id' })
    expect(delOneOrganization).toBeDefined()
    delOneOrganization({ id: 'id' })
    delOneOrganization({ id: 'id' })
    expect(loadingOrganizations).toBe(false)
  })

  test('without organizations', () => {
    mockOrganizations.mockImplementation(() => {
      // Empty
    })
    const [organizations] = useOrganizations()
    expect(organizations).toEqual([])
  })
})
