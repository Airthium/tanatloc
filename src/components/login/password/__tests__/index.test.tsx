import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Password, { errors } from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockSuccessNotification = jest.fn()
const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  SuccessNotification: () => mockSuccessNotification(),
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockEmailRecover = jest.fn()
jest.mock('@/api/email', () => ({
  recover: async () => mockEmailRecover()
}))

describe('components/login/password', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockSuccessNotification.mockReset()
    mockErrorNotification.mockReset()

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
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk(values)
          } catch (err) {}
        }}
      ></div>
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
    await waitFor(() =>
      expect(mockSuccessNotification).toHaveBeenCalledTimes(1)
    )

    // Error
    mockEmailRecover.mockImplementation(() => {
      throw new Error('recover error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenCalledWith(
        errors.recover,
        new Error('recover error')
      )
    )

    unmount()
  })
})
