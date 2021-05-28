import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import List from '..'

jest.mock('next/router', () => ({
  useRouter: () => [{ push: () => {} }]
}))

jest.mock('@/components/assets/share', () => {
  const Share = () => <div />
  return Share
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  update: async () => mockUpdate()
}))

describe('component/project/list', () => {
  const user = { id: 'id' }
  const workspace = { id: 'id' }
  const filter = 'filter'
  const projects = [{}, {}]
  const organizations = []
  const swr = {
    delOneProject: jest.fn(),
    mutateOneProject: jest.fn(),
    loadingProjects: false
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <List
        user={user}
        workspace={workspace}
        filter={filter}
        projects={projects}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  // test('mount', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <List
  //       user={user}
  //       workspace={workspace}
  //       filter={filter}
  //       projects={projects}
  //       organizations={organizations}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })

  // test('with projects', () => {
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <List
  //       user={user}
  //       workspace={workspace}
  //       filter={filter}
  //       projects={[{ id: 'id', title: 'with filter' }]}
  //       organizations={organizations}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()

  //   // With avatar, description, owners, users, groups
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <List
  //       user={user}
  //       workspace={workspace}
  //       filter={filter}
  //       projects={[
  //         {
  //           id: 'id',
  //           title: 'with filter',
  //           description: 'description',
  //           avatar: 'avatar',
  //           owners: [{ id: 'id' }],
  //           users: [{ id: 'id1' }],
  //           groups: [{ id: 'id2' }]
  //         },
  //         {
  //           id: 'id1',
  //           title: 'with filter',
  //           avatar: 'avatar',
  //           owners: [{ id: 'id' }],
  //           users: [{ id: 'id1' }],
  //           groups: [{ id: 'id2' }]
  //         }
  //       ]}
  //       organizations={organizations}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()

  //   // // Mouse enter (first project)
  //   // act(() => wrapper.find('div').at(7).props().onMouseEnter())

  //   // // Mouse leave (first project)
  //   // act(() => wrapper.find('div').at(7).props().onMouseLeave())

  //   // // on click (first project)
  //   // act(() => wrapper.find('div').at(7).props().onClick())

  //   // // Mouse enter (second project)
  //   // act(() => wrapper.find('div').at(24).props().onMouseEnter())
  // })
})
