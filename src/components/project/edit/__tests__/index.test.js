import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Edit from '..'

jest.mock('@/components/assets/dialog', () => {
  const Dialog = () => <div />
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/project', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/edit', () => {
  const project = { id: 'id', title: 'title', description: 'description' }
  const swr = {
    mutateOneProject: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit project={project} swr={swr} />)

    unmount()
  })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('Dialog').props().onCancel()
  // })

  // test('onEdit', async () => {
  //   // Normal
  //   await wrapper.find('Dialog').props().onOk({})
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(swr.mutateOneProject).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Dialog').props().onOk({})
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(swr.mutateOneProject).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
