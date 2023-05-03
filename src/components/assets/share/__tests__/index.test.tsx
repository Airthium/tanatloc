import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Share, { errors } from '..'
import { IFrontProjectsItem, IFrontWorkspacesItem } from '@/api/index.d'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockPush()
  })
}))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

const mockLinkButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  LinkButton: (props: any) => mockLinkButton(props)
}))

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
    groups: [{ id: 'id' } as IFrontProjectsItem['groups'][0]],
    users: [{ id: 'id1' } as IFrontProjectsItem['users'][0]]
  }
  const workspace = {
    id: 'id',
    name: 'name',
    groups: [{ id: 'id' } as IFrontWorkspacesItem['groups'][0]],
    users: [{ id: 'id' } as IFrontWorkspacesItem['users'][0]]
  }
  const organizations = [
    {
      id: 'id0',
      name: 'organization name',
      owners: [
        {
          id: 'ownerid',
          email: 'owneremail'
        }
      ],
      users: [
        {
          id: 'userid',
          email: 'useremail'
        }
      ],
      groups: [
        {
          id: 'id',
          name: 'group name',
          users: [
            {
              id: 'id1',
              email: 'email',
              lastname: 'lastname',
              firstname: 'firstname'
            },
            { id: 'id2', email: 'email' },
            { id: 'id3', email: 'email', lastname: 'lastname' },
            { id: 'id4', email: 'email', firstname: 'firstname' }
          ]
        }
      ]
    }
  ]
  const projectSwr = { mutateOneProject: jest.fn() }
  const workspaceSwr = { mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockPush.mockReset()

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockLinkButton.mockReset()
    mockLinkButton.mockImplementation(() => <div />)

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

  test('no workspace & project', () => {
    const { unmount } = render(
      <Share organizations={organizations} swr={projectSwr} />
    )

    unmount()
  })

  test('disabled', () => {
    const { unmount } = render(
      <Share
        disabled={true}
        project={project}
        organizations={organizations}
        swr={projectSwr}
      />
    )

    unmount()
  })

  test('electron', () => {
    mockIsElectron.mockImplementation(() => true)
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

  test('empty organizations', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    mockLinkButton.mockImplementation((props) => (
      <div role="LinkButton" onClick={props.onClick} />
    ))
    const { unmount } = render(
      <Share project={project} organizations={[]} swr={projectSwr} />
    )

    const button = screen.getByRole('LinkButton')
    fireEvent.click(button)

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onChange', () => {
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
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockProjectUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(projectSwr.mutateOneProject).toHaveBeenCalledTimes(1)
    )

    // Error
    mockProjectUpdate.mockImplementation(() => {
      throw new Error('project error')
    })
    await act(() => fireEvent.click(dialog))
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
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(workspaceSwr.mutateOneWorkspace).toHaveBeenCalledTimes(1)
    )

    // Error
    mockWorkspaceUpdate.mockImplementation(() => {
      throw new Error('workspace error')
    })
    await act(() => fireEvent.click(dialog))
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
