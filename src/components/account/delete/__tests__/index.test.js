import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Delete from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div role="DeleteDialog" />
  return { DeleteDialog }
})

const mockDel = jest.fn()
jest.mock('@/api/user', () => ({
  del: async () => mockDel()
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => async () => mockLogout())

let wrapper
describe('components/account/delete', () => {
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()

    mockLogout.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    const { unmount } = render(<Delete swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByRole('DeleteDialog')).toBeDefined()

    unmount()
  })

  // test('visible', () => {
  //   const visible = wrapper.find('DeleteDialog').props().visible
  //   wrapper.find('Button').props().onClick()
  //   expect(wrapper.find('DeleteDialog').props().visible).toBe(!visible)

  //   wrapper.find('DeleteDialog').props().onCancel()
  //   expect(wrapper.find('DeleteDialog').props().visible).toBe(visible)
  // })

  // test('handleDelete', async () => {
  //   // Normal
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockDel).toHaveBeenCalledTimes(1)
  //   expect(mockLogout).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)
  //   wrapper.unmount()

  //   // Error
  //   mockDel.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper = shallow(<Delete swr={swr} />)
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockDel).toHaveBeenCalledTimes(2)
  //   expect(mockLogout).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
