import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Organizations from '..'

jest.mock('../add', () => () => <div />)

const mockList = jest.fn()
jest.mock('../list', () => (props) => mockList(props))

const mockOrganization = jest.fn()
jest.mock(
  '@/components/assets/organization',
  () => (props) => mockOrganization(props)
)

describe('components/organizations', () => {
  const user = { id: 'id' }
  const organizations = []

  const swr = {
    reloadOrganizations: jest.fn(),
    addOneOrganization: jest.fn(),
    delOneOrganization: jest.fn(),
    mutateOneOrganization: jest.fn(),
    loadingOrganizations: false
  }

  beforeEach(() => {
    mockList.mockReset()
    mockList.mockImplementation(() => <div />)

    mockOrganization.mockReset()
    mockOrganization.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(
      <Organizations user={user} organizations={organizations} swr={swr} />
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
        organizations={[...organizations, { id: 'id' }]}
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
        organizations={[...organizations, { id: 'id' }]}
        swr={swr}
      />
    )

    const list = screen.getByRole('List')
    fireEvent.click(list)

    unmount()
  })
})
