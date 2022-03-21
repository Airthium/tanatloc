import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Share, { errors } from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
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
  const project = {
    id: 'id',
    title: 'title',
    groups: [{ id: 'id' }],
    users: [{ id: 'id' }]
  }
  const workspace = {
    id: 'id',
    name: 'name',
    groups: [{ id: 'id' }],
    users: [{ id: 'id' }]
  }
  const organizations = [
    {
      id: 'id0',
      groups: [
        {
          id: 'id',
          name: 'group name',
          users: [
            { id: 'id1', lastname: 'lastname', firstname: 'firstname' },
            { id: 'id2', email: 'email' },
            { id: 'id3', lastname: 'lastname' },
            { id: 'id4', firstname: 'firstname' }
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

    mockErrorNotification.mockReset()

    mockProjectUpdate.mockReset()

    mockWorkspaceUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Share project={project} organizations={organizations} swr={projectSwr} />
    )

    unmount()
  })

  test('render - light, dark, bordered', () => {
    const { unmount } = render(
      <Share
        project={project}
        organizations={organizations}
        swr={projectSwr}
        style={{ buttonLight: true, buttonDark: true, buttonBordered: true }}
      />
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

    const closes = screen.getAllByLabelText('close')
    fireEvent.click(closes[0])
    fireEvent.click(closes[1])

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
      throw new Error('project error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockProjectUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.share,
        new Error('project error')
      )
    )

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
      throw new Error('workspace error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.share,
        new Error('workspace error')
      )
    )

    unmount()
  })
})
