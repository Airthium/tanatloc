import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Delete from '@/components/project/simulation/delete'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDel = jest.fn()
jest.mock('@/api/simulation', () => ({
  del: async () => mockDel()
}))

describe('components/project/simulation/delete', () => {
  const simulation = { id: 'id', name: 'name' }
  const reloadProject = jest.fn()
  const delOneSimulation = jest.fn()
  const swr = {
    reloadProject,
    delOneSimulation
  }
  beforeEach(() => {
    mockError.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete simulation={simulation} swr={swr} />)

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
  //   expect(delOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(reloadProject).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockDel.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockDel).toHaveBeenCalledTimes(2)
  //   expect(delOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(reloadProject).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
