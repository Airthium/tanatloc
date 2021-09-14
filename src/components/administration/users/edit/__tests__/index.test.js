import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: () => mockPasswordItem()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdateById = jest.fn()
jest.mock('@/api/user', () => ({
  updateById: async () => mockUpdateById()
}))

describe('components/administration/users/edit', () => {
  const plugins = []
  const user = { id: 'id', email: 'email' }
  const swr = { mutateOneUser: jest.fn() }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockError.mockReset()

    mockUpdateById.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit plugins={plugins} user={user} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Edit plugins={plugins} user={user} swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onUpdate', async () => {
    let returned = {}
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk(returned)
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Edit
        plugins={[...plugins, { key: 'key', name: 'name' }]}
        user={user}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    returned = {
      firstname: 'firstname',
      lastname: undefined,
      password: 'password',
      key: '******'
    }
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneUser).toHaveBeenCalledTimes(1))

    // Error
    returned = {}
    mockUpdateById.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
