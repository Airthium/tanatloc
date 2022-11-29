import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Input } from 'antd'

import Dialog, { DeleteDialog, errors } from '@/components/assets/dialog'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('../delete', () => () => <div />)

describe('components/assets/dialog', () => {
  const mockOnOk = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    mockErrorNotification.mockReset()

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
      throw new Error('onOk error')
    })
    fireEvent.click(ok)
    await waitFor(() => expect(mockOnOk).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.onOk,
        new Error('onOk error')
      )
    )

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

    unmount()
  })

  test('onKeyUp', async () => {
    const { unmount } = render(
      <Dialog
        title="title"
        visible={true}
        initialValues={{}}
        onCancel={mockOnCancel}
        onOk={mockOnOk}
        loading={false}
      >
        <Input />
      </Dialog>
    )

    const input = screen.getByRole('textbox')

    fireEvent.keyUp(input, { key: 'Enter', keyCode: 1 })
    fireEvent.keyUp(input, { key: 'Enter', keyCode: 13 })

    unmount()
  })

  test('onKeyUp, without onOk', async () => {
    const { unmount } = render(
      <Dialog
        title="title"
        visible={true}
        initialValues={{}}
        onCancel={mockOnCancel}
        loading={false}
      >
        <Input />
      </Dialog>
    )

    const input = screen.getByRole('textbox')

    fireEvent.keyUp(input, { key: 'Enter', keyCode: 13 })

    unmount()
  })
})
