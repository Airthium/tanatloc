import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit, { errors } from '..'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  update: async () => mockUpdate()
}))

describe('components/workspace/edit', () => {
  const workspace = { id: 'id' }
  const swr = { mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    swr.mutateOneWorkspace.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit workspace={workspace} swr={swr} />)

    unmount()
  })

  test('visible', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))

    const { unmount } = render(<Edit workspace={workspace} swr={swr} />)

    const button = screen.getByRole('EditButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('edit', async () => {
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

    const { unmount } = render(<Edit workspace={workspace} swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })
})
