import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props) => mockPasswordItem(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/plugins', () => ({
  key: {
    name: 'name',
    key: 'key'
  }
}))

const mockAdd = jest.fn()
const mockUpdateById = jest.fn()
jest.mock('@/api/user', () => ({
  add: async () => mockAdd(),
  updateById: async () => mockUpdateById()
}))

describe('components/administration/users/add', () => {
  const swr = { addOneUser: jest.fn() }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdateById.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Add swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', async () => {
    mockAdd.mockImplementation(() => ({ alreadyExists: true }))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(<Add swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Already exists
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))

    // Not exists
    mockAdd.mockImplementation(() => ({}))
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneUser).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
