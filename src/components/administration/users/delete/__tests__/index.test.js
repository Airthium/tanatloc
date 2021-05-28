import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Delete from '..'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDelById = jest.fn()
jest.mock('@/api/user', () => ({
  delById: async () => mockDelById()
}))

describe('components/administration/users/delete', () => {
  const user = { id: 'id' }
  const swr = { delOneUser: jest.fn() }

  beforeEach(() => {
    mockError.mockReset()

    mockDelById.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete user={user} swr={swr} />)

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('DeleteDialog').props().onCancel()
  // })

  // test('onDelete', async () => {
  //   // Normal
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockDelById).toHaveBeenCalledTimes(1)
  //   expect(delOneUser).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockDelById.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockDelById).toHaveBeenCalledTimes(2)
  //   expect(delOneUser).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
