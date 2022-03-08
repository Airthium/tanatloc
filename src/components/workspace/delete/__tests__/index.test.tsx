import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete, { errors } from '..'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockDel = jest.fn()
jest.mock('@/api/workspace', () => ({
  del: async () => mockDel()
}))

describe('components/workspace/delete', () => {
  const workspace = { id: 'id' }
  const swr = { delOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete workspace={workspace} swr={swr} />)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(<Delete workspace={workspace} swr={swr} />)

    const button = screen.getByRole('DeleteButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.delOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('del error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('del error')
      )
    )

    unmount()
  })
})
