import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Delete from '@/components/workspace/delete'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDel = jest.fn()
jest.mock('@/api/workspace', () => ({
  del: async () => mockDel()
}))

describe('components/workspace/delete', () => {
  const workspace = { id: 'id' }
  const delOneWorkspace = jest.fn()
  const swr = { delOneWorkspace }

  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete workspace={workspace} swr={swr} />)

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
  //   expect(mockDel).toHaveBeenCalledTimes(1)
  //   expect(delOneWorkspace).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockDel.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockDel).toHaveBeenCalledTimes(2)
  //   expect(delOneWorkspace).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
