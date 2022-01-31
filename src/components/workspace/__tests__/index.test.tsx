import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Workspace from '..'

jest.mock('@/components/assets/share', () => () => <div />)

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../delete', () => () => <div />)

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

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
const mockErrorProjects = jest.fn()
const mockLoadingProjects = jest.fn()
jest.mock('@/api/project', () => ({
  useProjects: () => [
    mockProjects(),
    {
      addOneProject: mockAddOneProject,
      delOneProject: mockDelOneProject,
      mutateOneProject: mockMutateOneProject,
      errorProjects: mockErrorProjects(),
      loadingProjects: mockLoadingProjects()
    }
  ]
}))

describe('components/workspace', () => {
  const loading = false
  const user = { id: 'id' }
  const workspace = {
    id: 'id',
    name: 'workspace',
    owners: [{ id: 'id' }],
    projects: []
  }
  const organizations = []
  const swr = { delOneWorkspace: jest.fn(), mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockError.mockReset()

    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    mockUpdate.mockReset()

    mockProjects.mockReset()
    mockProjects.mockImplementation(() => [])
    mockAddOneProject.mockReset()
    mockDelOneProject.mockReset()
    mockMutateOneProject.mockReset()
    mockErrorProjects.mockReset()
    mockLoadingProjects.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Workspace
        loading={loading}
        user={user}
        page="page"
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('loading', () => {
    const { unmount } = render(
      <Workspace
        loading={true}
        user={user}
        page="page"
        workspace={workspace}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('error', () => {
    mockErrorProjects.mockImplementation(() => true)
    const { unmount } = render(
      <Workspace
        loading={true}
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
        loading={loading}
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
        loading={loading}
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
        loading={loading}
        user={{ id: 'id' }}
        page="page"
        workspace={{
          ...workspace,
          owners: [{ id: 'id' }],
          users: [{ id: 'id' }],
          groups: [{ id: 'id' }]
        }}
        organizations={organizations}
        swr={swr}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'project' } })

    unmount()
  })

  test('propTypes', () => {
    let res
    const propTypes = Workspace.propTypes

    // User
    const userProps = propTypes.user
    res = userProps({ loading: true }, 'user', 'Workspace')
    expect(res).toBe(undefined)

    res = userProps({ loading: false }, 'user', 'Workspace')
    expect(res.message).toBe('Missing prop user supplied to Workspace.')

    res = userProps({ loading: false, user: {} }, 'user', 'Workspace')
    expect(res.message).toBe(
      'Invalid prop user supplied to Workspace. Missing id'
    )

    res = userProps({ loading: false, user: { id: {} } }, 'user', 'Workspace')
    expect(res.message).toBe(
      'Invalid prop user supplied to Workspace. Invalid id'
    )

    res = userProps({ loading: false, user: { id: 'id' } }, 'user', 'Workspace')
    expect(res).toBe(undefined)

    // Workspace
    const workspaceProps = propTypes.workspace
    res = workspaceProps({ loading: true }, 'workspace', 'Workspace')
    expect(res).toBe(undefined)

    res = workspaceProps({ loading: false }, 'workspace', 'Workspace')
    expect(res.message).toBe('Missing prop workspace supplied to Workspace.')

    res = workspaceProps(
      { loading: false, workspace: {} },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Missing id'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: {} } },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Invalid id'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: 'id' } },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Missing projects'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: 'id', projects: 'projects' } },
      'workspace',
      'Workspace'
    )
    expect(res.message).toBe(
      'Invalid prop workspace supplied to Workspace. Invalid projects'
    )

    res = workspaceProps(
      { loading: false, workspace: { id: 'id', projects: [] } },
      'workspace',
      'Workspace'
    )
    expect(res).toBe(undefined)
  })
})
