import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontOrganizationsItem, IFrontProjectsItem } from '@/api/index.d'

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

type TProject = Pick<
  IFrontProjectsItem,
  | 'id'
  | 'archived'
  | 'title'
  | 'description'
  | 'createddate'
  | 'lastaccess'
  | 'avatar'
  | 'owners'
  | 'users'
  | 'groups'
>

describe('component/project/list', () => {
  const user = { id: 'id' }
  const workspace = { id: 'id', projects: [] }
  const filter = 'filter'
  const sorter = 'sorter'
  const projects = [{ id: 'id' } as TProject, { id: 'id' } as TProject]
  const organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[] = [{ id: 'id', name: 'name', owners: [], users: [], groups: [] }]
  const swr = {
    mutateOneWorkspace: jest.fn,
    delOneProject: jest.fn,
    mutateOneProject: jest.fn,
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
          { id: 'id1', title: 'project 1' } as TProject,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as TProject['owners'][0]],
            users: [{ id: 'id1' } as TProject['users'][0]],
            groups: [{ id: 'id2' } as TProject['groups'][0]]
          } as TProject,
          {
            id: 'id3',
            archived: true,
            title: 'archive 1',
            description: 'This is an archived project'
          } as TProject
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

    const archived = screen.getAllByText('This is an archived project')
    fireEvent.click(archived[1])
    expect(mockPush).toHaveBeenCalledTimes(2)

    const image = screen.getByRole('img', { name: 'Tanatloc' })
    fireEvent.click(image)
    expect(mockPush).toHaveBeenCalledTimes(3)

    unmount()
  })

  test('sorter alphAsc', () => {
    const { unmount } = render(
      <List
        user={user}
        page="page"
        workspace={workspace}
        projects={[
          { id: 'id1', title: 'project 1' } as TProject,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as TProject['owners'][0]],
            users: [{ id: 'id1' } as TProject['users'][0]],
            groups: [{ id: 'id2' } as TProject['groups'][0]]
          } as TProject,
          { id: 'id3', archived: true, title: 'archive 1' } as TProject
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
          { id: 'id1', title: 'project 1' } as TProject,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as TProject['owners'][0]],
            users: [{ id: 'id1' } as TProject['users'][0]],
            groups: [{ id: 'id2' } as TProject['groups'][0]]
          } as TProject,
          { id: 'id3', archived: true, title: 'archive 1' } as TProject
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
          { id: 'id1', title: 'project 1' } as TProject,
          {
            id: 'id2',
            title: 'project 2',
            description: 'description',
            avatar: Buffer.from('avatar'),
            owners: [{ id: 'id' } as TProject['owners'][0]],
            users: [{ id: 'id1' } as TProject['users'][0]],
            groups: [{ id: 'id2' } as TProject['groups'][0]]
          } as TProject,
          { id: 'id3', archived: true, title: 'archive 1' } as TProject
        ]}
        sorter="modifiedDesc"
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })
})
