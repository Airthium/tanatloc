import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import About from '@/components/project/simulation/about'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/project/simulation/delete', () => {
  const Delete = () => <div />
  return Delete
})

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/about', () => {
  const simulation = {
    id: 'id',
    name: 'name'
  }
  const swr = {
    reloadProject: jest.fn(),
    delOneSimulation: jest.fn(),
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<About simulation={simulation} swr={swr} />)

    unmount()
  })

  // test('handleName', async () => {
  //   await wrapper.find('Title').props().editable.onChange('name')
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('Title').props().editable.onChange('name')
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(mutateOneSimulation).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // test('without simulation', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(<About swr={swr} />)
  //   expect(wrapper).toBeDefined()
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<About simulation={simulation} swr={swr} />)
  // //   expect(wrapper).toBeDefined()
  // // })
})
