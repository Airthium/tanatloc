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
jest.mock('@/api/organization', () => ({
  add: async () => mockAdd()
}))

describe('components/organizations/add', () => {
  const swr = {
    addOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add swr={swr} />)

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // No visible
  //   wrapper.find('Dialog').props().onCancel()
  // })

  // test('onAdd', async () => {
  //   // Normal
  //   mockAdd.mockImplementation(() => ({}))
  //   await wrapper.find('Dialog').props().onOk({ name: 'name' })
  //   expect(mockAdd).toHaveBeenCalledTimes(1)
  //   expect(addOneOrganization).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk({ name: 'name' })
  //   expect(mockAdd).toHaveBeenCalledTimes(2)
  //   expect(addOneOrganization).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
