import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Archive from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockProjectArchive = jest.fn()
jest.mock('@/api/project', () => ({
  archive: async () => mockProjectArchive()
}))

describe('components/project/archive', () => {
  const workspace = {
    id: 'id'
  }
  const project = {
    id: 'id',
    archived: false,
    title: 'Title'
  }
  const swr = {
    mutateOneWorkspace: jest.fn(),
    mutateOneProject: jest.fn()
  }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockProjectArchive.mockReset()

    swr.mutateOneWorkspace.mockReset()
    swr.mutateOneProject.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Archive workspace={workspace} project={project} swr={swr} />
    )

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))

    const { unmount } = render(
      <Archive workspace={workspace} project={project} swr={swr} />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onArchive', async () => {
    Object.defineProperty(window.URL, 'createObjectURL', { value: () => 'url' })
    mockProjectArchive.mockImplementation(() => ({
      blob: async () => 'blob'
    }))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))

    const { unmount } = render(
      <Archive workspace={workspace} project={project} swr={swr} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockProjectArchive).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneProject).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockProjectArchive.mockImplementation(() => {
      throw new Error('error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockProjectArchive).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
