import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Dialog, { DeleteDialog } from '@/components/assets/dialog'

jest.mock('../delete', () => () => <div />)

const mockOnOk = jest.fn()
const mockOnCancel = jest.fn()
describe('components/assets/dialog', () => {
  beforeEach(() => {
    mockOnCancel.mockReset()
    mockOnOk.mockReset()
  })

  test('export', () => {
    expect(DeleteDialog).toBeDefined()
  })

  test('render', () => {
    const { unmount } = render(
      <Dialog
        title="title"
        visible={false}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      >
        Test
      </Dialog>
    )

    unmount()
  })

  test('without onOk & onCancel', () => {
    const { unmount } = render(
      <Dialog title="title" visible={false} loading={false}>
        Test
      </Dialog>
    )

    unmount()
  })

  test('onCancel', () => {
    const { unmount } = render(
      <Dialog
        title="title"
        visible={true}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      >
        Test
      </Dialog>
    )

    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)
    expect(mockOnCancel).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onOk', async () => {
    const { unmount } = render(
      <Dialog
        title="title"
        visible={true}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      >
        Test
      </Dialog>
    )

    const ok = screen.getByRole('button', { name: 'OK' })

    // Normal
    fireEvent.click(ok)
    await waitFor(() => expect(mockOnOk).toHaveBeenCalledTimes(1))

    // Error
    mockOnOk.mockImplementation(() => {
      throw new Error('error')
    })
    fireEvent.click(ok)
    await waitFor(() => expect(mockOnOk).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('initialValues', () => {
    const { unmount } = render(
      <Dialog
        title="title"
        visible={true}
        initialValues={{}}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      >
        Test
      </Dialog>
    )

    // expect(mockSetFieldsValue).toHaveBeenCalledTimes(1)

    unmount()
  })
})
