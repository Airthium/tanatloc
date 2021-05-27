import React from 'react'
import { render, screen } from '@testing-library/react'

import Information from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: () => mockUpdate()
}))

const mockAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAdd()
}))

global.FileReader = class {
  addEventListener(type, callback) {
    callback()
  }
  readAsDataURL() {}
}

describe('components/account/information', () => {
  const user = {}
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    unmount()
  })

  // test('with avatar', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Information
  //       user={{ ...user, avatar: { type: 'Buffer', data: [] } }}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })

  // test('onFinish', async () => {
  //   // Normal
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     firstname: 'firstname',
  //     lastname: 'lastname',
  //     email: 'email'
  //   })
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  //   expect(mockUpdate).toHaveBeenCalledTimes(3)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // test('onCancel', () => {
  //   wrapper.find('Button').at(2).props().onClick()
  // })

  // test('beforeUpload', () => {
  //   let res

  //   // Wrong
  //   res = wrapper
  //     .find('Upload')
  //     .props()
  //     .beforeUpload({ type: 'default', size: 5.1e7 })
  //   expect(res).toBe(false)

  //   // Good
  //   res = wrapper
  //     .find('Upload')
  //     .props()
  //     .beforeUpload({ type: 'image/jpeg', size: 1024 })
  //   expect(res).toBe(true)
  // })

  // test('onChange', async () => {
  //   // Uploading
  //   await wrapper
  //     .find('Upload')
  //     .props()
  //     .onChange({
  //       file: {
  //         status: 'uploading'
  //       }
  //     })
  //   expect(mockAdd).toHaveBeenCalledTimes(0)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Done
  //   await wrapper
  //     .find('Upload')
  //     .props()
  //     .onChange({
  //       file: {
  //         status: 'done',
  //         originFileObj: 'content'
  //       }
  //     })
  //   expect(mockAdd).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper
  //     .find('Upload')
  //     .props()
  //     .onChange({
  //       file: {
  //         status: 'done',
  //         originFileObj: 'content'
  //       }
  //     })
  //   expect(mockAdd).toHaveBeenCalledTimes(2)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
