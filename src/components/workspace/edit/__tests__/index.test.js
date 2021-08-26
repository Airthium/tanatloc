import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/workspace', () => ({
  update: async () => mockUpdate()
}))

describe('components/workspace/edit', () => {
  const workspace = { id: 'id' }
  const swr = { mutateOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    swr.mutateOneWorkspace.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit workspace={workspace} swr={swr} />)

    unmount()
  })

  test('visible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))

    const { unmount } = render(<Edit workspace={workspace} swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('edit', async () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))

    const { unmount } = render(<Edit workspace={workspace} swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
