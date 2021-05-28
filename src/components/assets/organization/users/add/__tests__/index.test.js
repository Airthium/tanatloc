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

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

describe('componenets/assets/organization/users/add', () => {
  const title = 'title'
  const organization = { id: 'id' }
  const dBkey = 'users'
  const swr = {
    mutateOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add title={title} organization={organization} dBkey={dBkey} swr={swr} />
    )

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('Dialog').props().onCancel()
  // })

  // test('onFinish', async () => {
  //   // Normal
  //   await wrapper.find('Dialog').props().onOk({})
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk({})
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
