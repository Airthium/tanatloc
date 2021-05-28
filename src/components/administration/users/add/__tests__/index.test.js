import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Add from '..'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

jest.mock('@/components/assets/input', () => {
  const PasswordItem = () => <div />
  return { PasswordItem }
})

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
    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdateById.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add swr={swr} />)

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible

  //   // Not visible
  // })

  // test('onAdd', async () => {
  //   // Normal
  //   mockAdd.mockImplementation(() => ({}))
  //   expect(mockAdd).toHaveBeenCalledTimes(1)
  //   expect(mockUpdateById).toHaveBeenCalledTimes(1)
  //   expect(addOneUser).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Already exists
  //   mockAdd.mockImplementation(() => ({ alreadyExists: true }))
  //   expect(mockAdd).toHaveBeenCalledTimes(2)
  //   expect(mockUpdateById).toHaveBeenCalledTimes(1)
  //   expect(addOneUser).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   expect(mockAdd).toHaveBeenCalledTimes(3)
  //   expect(mockUpdateById).toHaveBeenCalledTimes(1)
  //   expect(addOneUser).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
