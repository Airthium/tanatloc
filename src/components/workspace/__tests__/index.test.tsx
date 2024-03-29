import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontOrganizationsItem, IFrontWorkspacesItem } from '@/api/index.d'

import Workspace from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: () => mockErrorNotification()
}))

jest.mock('@/components/assets/share', () => () => <div />)

jest.mock('@/components/project/add', () => () => <div />)
jest.mock('@/components/project/list', () => () => <div />)

const mockUserToAvatar = jest.fn()
const mockGroupToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar(),
  groupToAvatar: () => mockGroupToAvatar()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  update: async () => mockUpdate()
}))

const mockProjects = jest.fn()
const mockAddOneProject = jest.fn()
const mockDelOneProject = jest.fn()
const mockMutateOneProject = jest.fn()
const mockErrorNotificationProjects = jest.fn()
const mockLoadingProjects = jest.fn()
jest.mock('@/api/project', () => ({
  useProjects: () => [
    mockProjects(),
    {
      addOneProject: mockAddOneProject,
      delOneProject: mockDelOneProject,
      mutateOneProject: mockMutateOneProject,
      errorProjects: mockErrorNotificationProjects(),
      loadingProjects: mockLoadingProjects()
    }
  ]
}))

jest.mock('../edit', () => () => <div />)
jest.mock('../delete', () => () => <div />)

describe('components/workspace', () => {
  const user = { id: 'id' }
  const workspace = {
    id: 'id',
    name: 'workspace',
    owners: [{ id: 'id' } as IFrontWorkspacesItem['owners'][0]],
    users: [],
    groups: [],
    projects: []
  }
  const organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[] = [{ id: 'id', name: 'name', owners: [], users: [], groups: [] }]
  const swr = { delOneWorkspace: jest.fn(), mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    mockUpdate.mockReset()

    mockProjects.mockReset()
    mockProjects.mockImplementation(() => [])
    mockAddOneProject.mockReset()
    mockDelOneProject.mockReset()
    mockMutateOneProject.mockReset()
    mockErrorNotificationProjects.mockReset()
    mockLoadingProjects.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Workspace
        user={user}
        page="page"
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('not owner', () => {
    const { unmount } = render(
      <Workspace
        user={user}
        page="page"
        workspace={{
          ...workspace,
          owners: [{ id: 'id1' } as IFrontWorkspacesItem['owners'][0]]
        }}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('error', () => {
    mockErrorNotificationProjects.mockImplementation(() => true)
    const { unmount } = render(
      <Workspace
        user={user}
        page="page"
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('onSearch', () => {
    const { unmount } = render(
      <Workspace
        user={user}
        page="page"
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'project' } })

    unmount()
  })

  test('onSort', () => {
    const { unmount } = render(
      <Workspace
        user={user}
        page="page"
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )

    const tab1 = screen.getByRole('tab', { name: 'Name (A-Z)' })
    const tab2 = screen.getByRole('tab', { name: 'Name (Z-A)' })
    const tab3 = screen.getByRole('tab', { name: 'Last modified' })

    fireEvent.click(tab1)
    fireEvent.click(tab2)
    fireEvent.click(tab3)

    unmount()
  })

  test('owner, users & groups', () => {
    const { unmount } = render(
      <Workspace
        user={{ id: 'id' }}
        page="page"
        workspace={{
          ...workspace,
          owners: [{ id: 'id' } as IFrontWorkspacesItem['owners'][0]],
          users: [{ id: 'id' } as IFrontWorkspacesItem['users'][0]],
          groups: [{ id: 'id' } as IFrontWorkspacesItem['groups'][0]]
        }}
        organizations={organizations}
        swr={swr}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'project' } })

    unmount()
  })
})
