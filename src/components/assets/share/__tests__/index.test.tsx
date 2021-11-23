import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Share from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockProjectUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  update: async () => mockProjectUpdate()
}))

const mockWorkspaceUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  update: async () => mockWorkspaceUpdate()
}))

describe('components/assets/share', () => {
  const project = { id: 'id', groups: [{ id: 'id' }] }
  const workspace = { id: 'id', groups: [{ id: 'id' }] }
  const organizations = [
    {
      id: 'id0',
      groups: [
        {
          id: 'id',
          name: 'group name',
          users: [
            { id: 'id1', lastname: 'lastname', firstname: 'firstname' },
            { id: 'id2', email: 'email' }
          ]
        }
      ]
    }
  ]
  const projectSwr = { mutateOneProject: jest.fn() }
  const workspaceSwr = { mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockProjectUpdate.mockReset()

    mockWorkspaceUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Share project={project} organizations={organizations} swr={projectSwr} />
    )

    unmount()
  })

  test('render with workspace', () => {
    const { unmount } = render(
      <Share
        workspace={workspace}
        organizations={organizations}
        swr={workspaceSwr}
      />
    )

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <Share project={project} organizations={organizations} swr={projectSwr} />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onSelectChange', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Share project={project} organizations={organizations} swr={projectSwr} />
    )

    const close = screen.getByLabelText('close')
    fireEvent.click(close)

    unmount()
  })

  test('onShare', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({})
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Share project={project} organizations={organizations} swr={projectSwr} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockProjectUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(projectSwr.mutateOneProject).toHaveBeenCalledTimes(1)
    )

    // Error
    mockProjectUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockProjectUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onShare with workspace', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({})
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Share
        workspace={workspace}
        organizations={organizations}
        swr={workspaceSwr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(workspaceSwr.mutateOneWorkspace).toHaveBeenCalledTimes(1)
    )

    // Error
    mockWorkspaceUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('propTypes', () => {
    let res

    // Project
    const projectProps = Share.propTypes.project
    res = projectProps({}, 'project', 'Share')
    expect(res.message).toBe(
      'Missing or invalid prop project supplied to Share.'
    )

    res = projectProps({ project: {} }, 'project', 'Share')
    expect(res.message).toBe(
      'Missing or invalid prop project supplied to Share.'
    )

    res = projectProps({ project: { id: 'id' } }, 'project', 'Share')
    expect(res).toBe(undefined)

    // Workspace
    const workspaceProps = Share.propTypes.workspace
    res = workspaceProps({}, 'workspace', 'Share')
    expect(res.message).toBe(
      'Missing or invalid prop workspace supplied to Share.'
    )

    res = workspaceProps({ workspace: {} }, 'workspace', 'Share')
    expect(res.message).toBe(
      'Missing or invalid prop workspace supplied to Share.'
    )

    res = workspaceProps({ workspace: { id: 'id' } }, 'workspace', 'Share')
    expect(res).toBe(undefined)

    // SWR
    const swrProps = Share.propTypes.swr
    res = swrProps({}, 'swr', 'Share')
    expect(res.message).toBe('Invalid prop swr supplied to Share. swr missing')

    res = swrProps({ project: {}, swr: {} }, 'swr', 'Share')
    expect(res.message).toBe(
      'Invalid prop swr supplied to Share. mutateOneProject missing or invalid'
    )

    res = swrProps(
      { project: {}, swr: { mutateOneProject: jest.fn() } },
      'swr',
      'Share'
    )
    expect(res).toBe(undefined)

    res = swrProps({ workspace: {}, swr: {} }, 'swr', 'Share')
    expect(res.message).toBe(
      'Invalid prop swr supplied to Share. mutateOneWorkspace missing or invalid'
    )

    res = swrProps(
      { workspace: {}, swr: { mutateOneWorkspace: jest.fn() } },
      'swr',
      'Share'
    )
    expect(res).toBe(undefined)
  })
})
