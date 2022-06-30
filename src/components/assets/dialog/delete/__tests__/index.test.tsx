import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import DeleteDialog, { errors } from '@/components/assets/dialog/delete'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

describe('components/assets/dialog', () => {
  test('render', () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={false}
        onCancel={jest.fn}
        onOk={async () => {
          // Empty
        }}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    unmount()
  })

  test('onCancel', () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={true}
        onCancel={jest.fn}
        onOk={async () => {
          // Empty
        }}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    const button = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={true}
        onCancel={jest.fn}
        onOk={async () => {
          // Empty
        }}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    const button = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(button)

    unmount()
  })

  test('onOk - error', async () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={true}
        onCancel={jest.fn}
        onOk={async () => {
          throw new Error('onOk error')
        }}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    const button = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(button)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.onOk,
        new Error('onOk error')
      )
    )

    unmount()
  })
})
