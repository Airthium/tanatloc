import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import List from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

jest.mock('@/components/assets/share', () => () => <div />)

jest.mock('../../edit', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

jest.mock('@/lib/utils', () => ({
  userToAvatar: () => 'user_avatar',
  groupToAvatar: () => 'group_avatar'
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
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <List
        user={user}
        workspace={workspace}
        projects={projects}
        organizations={organizations}
        filter={filter}
        swr={swr}
      />
    )

    unmount()
  })

  test('with projects', () => {
    const { unmount } = render(
      <List
        user={user}
        workspace={workspace}
        projects={[
          { id: 'id1', title: 'project 1' },
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: 'avatar',
            owners: [{ id: 'id' }],
            users: [{ id: 'id1' }],
            groups: [{ id: 'id2' }]
          }
        ]}
        organizations={organizations}
        swr={swr}
      />
    )

    const empty = screen.getByRole('img', { name: 'No preview yet.' })
    fireEvent.click(empty)
    expect(mockPush).toHaveBeenCalledTimes(1)

    const descriptions = screen.getAllByText('description')
    fireEvent.click(descriptions[0])
    expect(mockPush).toHaveBeenCalledTimes(2)

    const image = screen.getByRole('img', { name: 'Tanatloc' })
    fireEvent.click(image)
    expect(mockPush).toHaveBeenCalledTimes(3)

    unmount()
  })
})
