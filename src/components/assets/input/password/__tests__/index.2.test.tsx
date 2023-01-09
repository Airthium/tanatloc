import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button, Form } from 'antd'

import PasswordItem from '..'

jest.mock('@/config/auth', () => ({
  MIN_SIZE: 6,
  MAX_SIZE: 16,
  REQUIRE_LETTER: false,
  REQUIRE_NUMBER: false,
  REQUIRE_SYMBOL: false
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

    // Numbers only
    await act(() => fireEvent.change(input, { target: { value: '12345678' } }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    // Letters only
    await act(() => fireEvent.change(input, { target: { value: 'abcdefgh' } }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(2))

    // Letters and numbers
    await act(() => fireEvent.change(input, { target: { value: 'abcd1234' } }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(3))

    // Ok
    await act(() => fireEvent.change(input, { target: { value: 'abcd1234&' } }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(4))

    unmount()
  })
})
