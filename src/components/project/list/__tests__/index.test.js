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
          { id: 'id1', title: 'with filter' },
          {
            id: 'id2',
            title: 'with filter',
            description: 'description',
            avatar: 'avatar',
            owners: [{ id: 'id' }],
            users: [{ id: 'id1' }],
            groups: [{ id: 'id2' }]
          }
        ]}
        organizations={organizations}
        filter={filter}
        swr={swr}
      />
    )

    // Show description
    const images = screen.getAllByRole('img')
    fireEvent.mouseEnter(images[0])
    fireEvent.mouseEnter(images[1])

    // Hide
    const descriptions = screen.getAllByText('description')
    fireEvent.mouseLeave(descriptions[0])

    const newImages = screen.getAllByRole('img')
    fireEvent.click(newImages[0])
    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })
})
