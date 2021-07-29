import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button, Form } from 'antd'

import PasswordItem from '..'

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

describe('components/assets/input/password', () => {
  beforeEach(() => {
    mockSystem.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Form>
        <PasswordItem />
      </Form>
    )

    unmount()
  })

  test('with system password', async () => {
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {
        min: 8,
        max: 16,
        requireLetter: true,
        requireNumber: true,
        requireSymbol: true
      }
    }))
    const onFinish = jest.fn()
    const { unmount } = render(
      <Form name="form" onFinish={onFinish}>
        <PasswordItem name="Password" />
        <Button htmlType="submit">Submit</Button>
      </Form>
    )

    const input = screen.getByLabelText('Password')
    const button = screen.getByRole('button')

    // Empty
    fireEvent.change(input, { taget: { value: undefined } })

    // Small
    fireEvent.change(input, { target: { value: 'small' } })

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })

    // Numbers only
    fireEvent.change(input, { target: { value: '12345678' } })

    // Letters only
    fireEvent.change(input, { target: { value: 'abcdefgh' } })

    // Letters and numbers
    fireEvent.change(input, { target: { value: 'abcd1234' } })

    // Ok
    fireEvent.change(input, { target: { value: 'abcd1234&' } })
    fireEvent.click(button)
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('without system password', async () => {
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {
        requireLetter: false,
        requireNumber: false,
        requireSymbol: false
      }
    }))

    const onFinish = jest.fn()
    const { unmount } = render(
      <Form name="form" onFinish={onFinish}>
        <PasswordItem name="Password" />
        <Button htmlType="submit">Submit</Button>
      </Form>
    )

    const input = screen.getByLabelText('Password')
    const button = screen.getByRole('button')

    // Empty
    fireEvent.change(input, { taget: { value: undefined } })

    // Small
    fireEvent.change(input, { target: { value: 'small' } })

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })

    // Numbers only
    fireEvent.change(input, { target: { value: '12345678' } })
    fireEvent.click(button)

    // Letters only
    fireEvent.change(input, { target: { value: 'abcdefgh' } })
    fireEvent.click(button)

    // Letters and numbers
    fireEvent.change(input, { target: { value: 'abcd1234' } })
    fireEvent.click(button)

    // Ok
    fireEvent.change(input, { target: { value: 'abcd1234&' } })
    fireEvent.click(button)
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('edit mode', async () => {
    const onFinish = jest.fn()
    const { unmount } = render(
      <Form name="form" onFinish={onFinish}>
        <PasswordItem name="Password" edit={true} />
        <Button htmlType="submit">Submit</Button>
      </Form>
    )

    const input = screen.getByLabelText('Password')
    const button = screen.getByRole('button')

    fireEvent.change(input, { target: { value: '******' } })
    fireEvent.click(button)
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })
})
