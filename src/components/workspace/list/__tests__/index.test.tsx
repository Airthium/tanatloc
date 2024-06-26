import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import List, { errors } from '..'

const mockQuery = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockQuery(),
    push: async () => mockPush()
  })
}))

jest.mock('@sentry/nextjs', () => ({ init: jest.fn }))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockWorkspaceAdd = jest.fn()
jest.mock('@/api/workspace', () => ({
  add: async () => mockWorkspaceAdd()
}))

jest.mock('../..', () => () => <div />)
jest.mock('../../add', () => () => <div />)
jest.mock('../../sample', () => () => <div />)

describe('components/workspace/list', () => {
  const user = { id: 'id', plugins: [] }
  const workspaces = [
    { id: 'id', name: 'name', projects: [], owners: [], users: [], groups: [] },
    {
      id: 'id2',
      name: 'otherworkspace',
      projects: [],
      owners: [],
      users: [],
      groups: []
    }
  ]
  const organizations = [
    { id: 'id', name: 'name', owners: [], users: [], groups: [] }
  ]
  const swr = {
    addOneWorkspace: jest.fn(),
    mutateOneWorkspace: jest.fn(),
    delOneWorkspace: jest.fn()
  }

  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockWorkspaceAdd.mockReset()

    swr.addOneWorkspace.mockReset()
    swr.mutateOneWorkspace.mockReset()
    swr.delOneWorkspace.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <List
        user={user}
        workspaces={workspaces}
        organizations={organizations}
        swr={swr}
      />
    )

    unmount()
  })

  test('empty workspaces', () => {
    const { unmount } = render(
      <List
        user={user}
        workspaces={[]}
        organizations={organizations}
        swr={swr}
      />
    )

    const plus = screen.getByRole('img', { name: 'plus-circle' })
    fireEvent.click(plus)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(
      <List
        user={user}
        workspaces={workspaces}
        organizations={organizations}
        swr={swr}
      />
    )

    const tab1 = screen.getByRole('img', { name: 'experiment' })
    fireEvent.click(tab1)

    const tab2 = screen.getByRole('tab', { name: 'otherworkspace' })
    fireEvent.click(tab2)

    unmount()
  })

  test('onAdd', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <List
        user={user}
        workspaces={workspaces}
        organizations={organizations}
        swr={swr}
      />
    )

    const add = screen.getAllByRole('img', { name: 'plus' })
    fireEvent.click(add[0])

    const dialog = screen.getByRole('Dialog')

    // Normal
    mockWorkspaceAdd.mockImplementation(() => ({}))
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))

    // Error
    mockWorkspaceAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('add error')
      )
    )

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <List
        user={user}
        workspaces={workspaces}
        organizations={organizations}
        swr={swr}
      />
    )

    const add = screen.getAllByRole('img', { name: 'plus' })
    fireEvent.click(add[0])

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
