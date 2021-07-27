import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Password from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockSuccess = jest.fn()
const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Success: () => mockSuccess(),
  Error: () => mockError()
}))

const mockEmailRecover = jest.fn()
jest.mock('@/api/email', () => ({
  recover: async () => mockEmailRecover()
}))

describe('components/login/password', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockSuccess.mockReset()
    mockError.mockReset()

    mockEmailRecover.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Password />)

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Password />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('passwordRecover', async () => {
    const values = { email: 'test@email.com' }
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk(values)}></div>
    ))
    const { unmount } = render(<Password />)

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Validate
    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    // Normal
    await waitFor(() => expect(mockEmailRecover).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockSuccess).toHaveBeenCalledTimes(1))

    // Error
    mockEmailRecover.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
