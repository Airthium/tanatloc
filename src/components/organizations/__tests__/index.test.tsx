import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontOrganizations } from '@/api/index.d'

import Organizations from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery()
  })
}))

const mockOrganization = jest.fn()
jest.mock(
  '@/components/assets/organization',
  () => (props: any) => mockOrganization(props)
)

jest.mock('../add', () => () => <div />)

const mockList = jest.fn()
jest.mock('../list', () => (props: any) => mockList(props))

describe('components/organizations', () => {
  const user = { id: 'id' }
  const organizations: IFrontOrganizations = []

  const swr = {
    addOneOrganization: jest.fn(),
    delOneOrganization: jest.fn(),
    mutateOneOrganization: jest.fn(),
    loadingOrganizations: false
  }

  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockOrganization.mockReset()
    mockOrganization.mockImplementation(() => <div />)

    mockList.mockReset()
    mockList.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(
      <Organizations user={user} organizations={organizations} swr={swr} />
    )

    unmount()
  })

  test('with query', () => {
    mockQuery.mockImplementation(() => ({
      organizationId: 'id'
    }))
    const { unmount } = render(
      <Organizations user={user} organizations={organizations} swr={swr} />
    )

    unmount()
  })

  test('with query, with organization', () => {
    mockQuery.mockImplementation(() => ({
      organizationId: 'id'
    }))
    const { unmount } = render(
      <Organizations
        user={user}
        organizations={[
          {
            id: 'id',
            name: 'name',
            owners: [],
            pendingowners: [],
            users: [],
            pendingusers: [],
            groups: []
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })

  test('setOrganization', () => {
    mockList.mockImplementation((props) => (
      <div role="List" onClick={() => props.setOrganization({ id: 'id' })} />
    ))
    mockOrganization.mockImplementation((props) => (
      <div role="Organization" onClick={props.onClose} />
    ))
    const { unmount } = render(
      <Organizations
        user={user}
        organizations={[
          ...organizations,
          {
            id: 'id',
            name: 'name',
            owners: [],
            pendingowners: [],
            users: [],
            pendingusers: [],
            groups: []
          }
        ]}
        swr={swr}
      />
    )

    const list = screen.getByRole('List')
    fireEvent.click(list)

    const organization = screen.getByRole('Organization')
    fireEvent.click(organization)

    unmount()
  })

  test('setOrganization (different)', () => {
    mockList.mockImplementation((props) => (
      <div role="List" onClick={() => props.setOrganization({})} />
    ))
    const { unmount } = render(
      <Organizations
        user={user}
        organizations={[
          ...organizations,
          {
            id: 'id',
            name: 'name',
            owners: [],
            pendingowners: [],
            users: [],
            pendingusers: [],
            groups: []
          }
        ]}
        swr={swr}
      />
    )

    const list = screen.getByRole('List')
    fireEvent.click(list)

    unmount()
  })
})
