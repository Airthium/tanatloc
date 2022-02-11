import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import List from '..'

const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockQuery()
  })
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockWorkspaceAdd = jest.fn()
jest.mock('@/api/workspace', () => ({
  add: async () => mockWorkspaceAdd()
}))

jest.mock('../..', () => () => <div />)
jest.mock('../../add', () => () => <div />)

describe('components/workspace/list', () => {
  const user = { id: 'id' }
  const workspaces = [{ id: 'id' }]
  const organizations = [{ id: 'id' }]
  const swr = {
    addOneWorkspace: jest.fn(),
    mutateOneWorkspace: jest.fn(),
    delOneWorkspace: jest.fn()
  }

  beforeEach(() => {
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

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

    const add = screen.getAllByRole('button', { name: 'Add tab' })
    fireEvent.click(add[0])

    const dialog = screen.getByRole('Dialog')

    // Error
    mockWorkspaceAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockWorkspaceAdd.mockImplementation(() => ({}))
    fireEvent.click(dialog)
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onCancel', async () => {
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

    const add = screen.getAllByRole('button', { name: 'Add tab' })
    fireEvent.click(add[0])

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
