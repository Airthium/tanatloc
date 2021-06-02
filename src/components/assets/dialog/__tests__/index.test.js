import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Dialog from '@/components/assets/dialog'

jest.mock('../delete')

jest.unmock('antd')
import antd from 'antd'

const mockSetFieldsValue = jest.fn()
const mockResetFields = jest.fn()
const mockOnOk = jest.fn()
const mockOnCancel = jest.fn()
describe('components/assets/dialog', () => {
  beforeEach(() => {
    mockResetFields.mockReset()
    mockOnCancel.mockReset()
    mockOnOk.mockReset()
    antd.Form.useForm = () => [
      {
        name: 'name',
        getInternalHooks: () => ({
          dispatch: jest.fn(),
          registerField: jest.fn(),
          useSubscribe: jest.fn(),
          setInitialValues: jest.fn(),
          setCallbacks: jest.fn(),
          setValidateMessages: jest.fn(),
          getFields: jest.fn(),
          setPreserve: jest.fn()
        }),
        resetFields: () => mockResetFields(),
        setFieldsValue: () => mockSetFieldsValue(),
        validateFields: async () => ({}),
        __INTERNAL__: {
          itemRef: jest.fn()
        }
      }
    ]
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
    await waitFor(() => expect(mockResetFields).toHaveBeenCalledTimes(1))

    // Error
    antd.Form.useForm = () => [
      {
        validateFields: async () => ({}),
        resetFields: () => {
          throw new Error()
        }
      }
    ]
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

    expect(mockSetFieldsValue).toHaveBeenCalledTimes(1)

    unmount()
  })
})
