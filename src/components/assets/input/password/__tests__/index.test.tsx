import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button, Form } from 'antd'

import PasswordItem, { errors } from '..'

jest.mock('@/config/auth', () => ({
  MIN_SIZE: 6,
  MAX_SIZE: 16,
  REQUIRE_LETTER: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SYMBOL: true
}))

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

  test('without system', async () => {
    mockSystem.mockImplementation(() => undefined)

    const onFinish = jest.fn()
    const { unmount } = render(
      <Form name="form" onFinish={onFinish}>
        <PasswordItem name="Password" />
        <Button role="SubmitButton" htmlType="submit">
          Submit
        </Button>
      </Form>
    )

    const input = screen.getByLabelText('Password')
    const button = screen.getByRole('SubmitButton')

    // Empty
    fireEvent.change(input, { taget: { value: '' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.password))

    // Small
    fireEvent.change(input, { target: { value: 'small' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordTooSmall(6)))

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordTooLong(16)))

    // Numbers only
    fireEvent.change(input, { target: { value: '12345678' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordRequireLetter))
    await waitFor(() => screen.getByText(errors.passwordRequireSymbol))

    // Letters only
    fireEvent.change(input, { target: { value: 'abcdefgh' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordRequireNumber))
    await waitFor(() => screen.getByText(errors.passwordRequireSymbol))

    // Letters and numbers
    fireEvent.change(input, { target: { value: 'abcd1234' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordRequireSymbol))

    // Ok
    fireEvent.change(input, { target: { value: 'abcd1234&' } })
    fireEvent.click(button)
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

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
        <Button role="SubmitButton" htmlType="submit">
          Submit
        </Button>
      </Form>
    )

    const input = screen.getByLabelText('Password')
    const button = screen.getByRole('SubmitButton')

    // Empty
    fireEvent.change(input, { taget: { value: undefined } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.password))

    // Small
    fireEvent.change(input, { target: { value: 'small' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordTooSmall(8)))

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordTooLong(16)))

    // Numbers only
    fireEvent.change(input, { target: { value: '12345678' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordRequireLetter))
    await waitFor(() => screen.getByText(errors.passwordRequireSymbol))

    // Letters only
    fireEvent.change(input, { target: { value: 'abcdefgh' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordRequireNumber))
    await waitFor(() => screen.getByText(errors.passwordRequireSymbol))

    // Letters and numbers
    fireEvent.change(input, { target: { value: 'abcd1234' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText(errors.passwordRequireSymbol))

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
        <Button role="SubmitButton" htmlType="submit">
          Submit
        </Button>
      </Form>
    )

    const input = screen.getByLabelText('Password')
    const button = screen.getByRole('SubmitButton')

    fireEvent.change(input, { target: { value: '******' } })
    fireEvent.click(button)
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })
})
