import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Organizations from '..'

jest.mock('../add', () => {
  const Add = () => <div />
  return Add
})

jest.mock('../list', () => {
  const List = () => <div />
  return List
})

jest.mock('@/components/assets/organization', () => {
  const Organization = () => <div />
  return Organization
})

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

  test('render', () => {
    const { unmount } = render(
      <Organizations user={user} organizations={organizations} swr={swr} />
    )

    unmount()
  })

  // test('setOrganization', () => {
  //   wrapper = mount(
  //     <Organizations
  //       user={user}
  //       organizations={[...organizations, { id: 'id' }]}
  //       swr={swr}
  //     />
  //   )

  //   act(() => wrapper.find('List').props().setOrganization({ id: 'id' }))
  //   wrapper.update()

  //   act(() => wrapper.find('Organization').props().onClose())
  //   wrapper.update()
  // })

  // test('effect', () => {
  //   wrapper = mount(
  //     <Organizations
  //       user={user}
  //       organizations={[...organizations, { id: 'id', diff: 'diff' }]}
  //       swr={swr}
  //     />
  //   )

  //   act(() => wrapper.find('List').props().setOrganization({ id: 'id' }))
  //   wrapper.update()
  // })
})
