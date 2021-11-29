import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DeleteDialog from '@/components/assets/dialog/delete'

describe('components/assets/dialog', () => {
  test('render', () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={false}
        onCancel={jest.fn}
        onOk={jest.fn}
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
        onOk={jest.fn}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    const button = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    const { unmount } = render(
      <DeleteDialog
        title="title"
        visible={true}
        onCancel={jest.fn}
        onOk={jest.fn}
        loading={false}
      >
        Are you sure ?
      </DeleteDialog>
    )

    const button = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(button)

    unmount()
  })
})
