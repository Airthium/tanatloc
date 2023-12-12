import { fireEvent, render, screen } from '@testing-library/react'

import List, { Project, Organization } from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockPush()
  })
}))

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

jest.mock('@/components/assets/share', () => () => <div />)

jest.mock('../../edit', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

jest.mock('../../archive', () => () => <div />)

jest.mock('../../copy', () => () => <div />)

jest.mock('@/lib/utils', () => ({
  userToAvatar: () => 'user_avatar',
  groupToAvatar: () => 'group_avatar'
}))

jest.useFakeTimers()

describe('component/project/list', () => {
  const user = { id: 'id' }
  const workspace = { id: 'id', projects: [] }
  const filter = 'filter'
  const sorter = 'sorter'
  const projects = [{ id: 'id' } as Project, { id: 'id' } as Project]
  const organizations: Organization[] = [
    { id: 'id', name: 'name', owners: [], users: [], groups: [] }
  ]
  const swr = {
    addOneProject: async () => undefined,
    mutateOneWorkspace: async () => undefined,
    delOneProject: async () => undefined,
    mutateOneProject: async () => undefined,
    loadingProjects: false
  }

  beforeEach(() => {
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={projects}
        organizations={organizations}
        filter={filter}
        sorter={sorter}
        swr={swr}
      />
    )

    jest.advanceTimersByTime(500)

    unmount()
  })

  test('without projects', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={[]}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('with projects', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={[
          {
            id: 'id1',
            title: 'project 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' }] as Project['owners'],
            users: [{ id: 'id1' }] as Project['users'],
            groups: [{ id: 'id2' }] as Project['groups']
          } as Project,
          {
            id: 'id3',
            archived: true,
            title: 'archive 1',
            description: 'This is an archived project',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project
        ]}
        organizations={organizations}
        swr={swr}
      />
    )

    const empty = screen.getByRole('img', { name: 'No preview yet.' })
    fireEvent.click(empty)
    fireEvent.keyUp(empty)
    expect(mockPush).toHaveBeenCalledTimes(1)

    const descriptions = screen.getAllByText('description')
    fireEvent.click(descriptions[0])
    expect(mockPush).toHaveBeenCalledTimes(2)

    const archived = screen.getAllByText('This is an archived project')
    fireEvent.click(archived[1])
    expect(mockPush).toHaveBeenCalledTimes(2)

    const image = screen.getByRole('img', { name: 'Tanatloc' })
    fireEvent.click(image)
    expect(mockPush).toHaveBeenCalledTimes(3)

    fireEvent.resize(window)

    unmount()
  })

  test('sorter alphAsc', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={[
          {
            id: 'id1',
            title: 'project 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as Project['owners'][0]],
            users: [{ id: 'id1' } as Project['users'][0]],
            groups: [{ id: 'id2' } as Project['groups'][0]]
          } as Project,
          {
            id: 'id3',
            archived: true,
            title: 'archive 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project
        ]}
        sorter="alphaAsc"
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('sorter alphDesc', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={[
          {
            id: 'id1',
            title: 'project 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as Project['owners'][0]],
            users: [{ id: 'id1' } as Project['users'][0]],
            groups: [{ id: 'id2' } as Project['groups'][0]]
          } as Project,
          {
            id: 'id3',
            archived: true,
            title: 'archive 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project
        ]}
        sorter="alphaDesc"
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('sorter modifiedDesc', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={[
          {
            id: 'id1',
            title: 'project 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as Project['owners'][0]],
            users: [{ id: 'id1' } as Project['users'][0]],
            groups: [{ id: 'id2' } as Project['groups'][0]]
          } as Project,
          {
            id: 'id3',
            archived: true,
            title: 'archive 1',
            owners: [],
            users: [],
            groups: []
          } as unknown as Project
        ]}
        sorter="modifiedDesc"
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })
})
