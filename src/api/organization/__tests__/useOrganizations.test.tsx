import { render } from '@testing-library/react'

import { useOrganizations } from '../useOrganizations'

const mockOrganizations = jest.fn()
jest.mock('swr', () => () => ({
  data: { organizations: mockOrganizations() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = () => {
  const [
    organizations,
    {
      addOneOrganization,
      mutateOneOrganization,
      delOneOrganization,
      loadingOrganizations
    }
  ] = useOrganizations()

  data = {
    organizations,
    swr: {
      addOneOrganization,
      mutateOneOrganization,
      delOneOrganization,
      loadingOrganizations
    }
  }

  return null
}

describe('api/organization/useOrganizations', () => {
  test('with organizations', () => {
    mockOrganizations.mockImplementation(() => [{ id: 'id' }, { id: 'id1' }])

    render(<FunctionalComponent />)

    expect(data.organizations).toEqual([{ id: 'id' }, { id: 'id1' }])
    expect(data.swr.addOneOrganization).toBeDefined()
    data.swr.addOneOrganization({ id: 'id', name: 'name', owners: ['id'] })
    expect(data.swr.mutateOneOrganization).toBeDefined()
    data.swr.mutateOneOrganization({ id: 'id' })
    data.swr.mutateOneOrganization({ id: 'id' })
    expect(data.swr.delOneOrganization).toBeDefined()
    data.swr.delOneOrganization({ id: 'id' })
    data.swr.delOneOrganization({ id: 'id' })
    expect(data.swr.loadingOrganizations).toBe(false)
  })

  test('without organizations', () => {
    mockOrganizations.mockImplementation(() => {
      // Empty
    })

    render(<FunctionalComponent />)

    expect(data.organizations).toEqual([])
  })
})
