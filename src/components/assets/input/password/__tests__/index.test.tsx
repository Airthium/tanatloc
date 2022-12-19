import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button, Form } from 'antd'

import PasswordItem from '..'

const mockConfig = jest.fn()
jest.mock('@/config/auth', () => () => mockConfig())

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

describe('components/assets/input/password', () => {
  beforeEach(() => {
    mockConfig.mockReset()
    mockConfig.mockImplementation(() => ({
      MIN_SIZE: 6,
      MAX_SIZE: 16,
      REQUIRE_LETTER: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SYMBOL: true
    }))

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

  test('without system', () => {
    mockSystem.mockImplementation(() => undefined)

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
    fireEvent.change(input, { taget: { value: '' } })
    fireEvent.click(button)

    // Small
    fireEvent.change(input, { target: { value: 'small' } })
    fireEvent.click(button)

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })
    fireEvent.click(button)

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
    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with system password', () => {
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
    fireEvent.click(button)

    // Small
    fireEvent.change(input, { target: { value: 'small' } })
    fireEvent.click(button)

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })
    fireEvent.click(button)

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
    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('without system password', () => {
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {}
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
    fireEvent.change(input, { taget: { value: '' } })
    fireEvent.click(button)

    // Small
    fireEvent.change(input, { target: { value: 'small' } })
    fireEvent.click(button)

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })
    fireEvent.click(button)

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
    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('without system password, without require', () => {
    mockConfig.mockImplementation(() => ({
      MIN_SIZE: 6,
      MAX_SIZE: 16,
      REQUIRE_LETTER: false,
      REQUIRE_NUMBER: false,
      REQUIRE_SYMBOL: false
    }))
    mockSystem.mockImplementation(() => ({
      allowsignup: true,
      password: {}
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
    fireEvent.change(input, { taget: { value: '' } })
    fireEvent.click(button)

    // Small
    fireEvent.change(input, { target: { value: 'small' } })
    fireEvent.click(button)

    // Long
    fireEvent.change(input, { target: { value: 'longlonglonglonglonglong' } })
    fireEvent.click(button)

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
    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('edit mode', () => {
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
    waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1))

    unmount()
  })
})
