import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Add from '..'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/project', () => ({
  add: async () => mockAdd()
}))

describe('components/project/add', () => {
  const workspace = { id: 'id' }
  const swr = {
    mutateOneWorkspace: jest.fn(),
    addOneProject: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add workspace={workspace} swr={swr} />)

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('Dialog').props().onCancel()
  // })

  // test('onAdd', async () => {
  //   // Normal
  //   mockAdd.mockImplementation(() => ({}))
  //   await wrapper.find('Dialog').props().onOk()
  //   expect(mockAdd).toHaveBeenCalledTimes(1)
  //   expect(addOneProject).toHaveBeenCalledTimes(1)
  //   expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk()
  //   expect(mockAdd).toHaveBeenCalledTimes(2)
  //   expect(addOneProject).toHaveBeenCalledTimes(1)
  //   expect(mutateOneWorkspace).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
