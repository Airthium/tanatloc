import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import PluginDialog from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => {
  const Dialog = (props) => mockDialog(props)
  return Dialog
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/plugin', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate()
}))

describe('components/account/hpc/dialog', () => {
  const plugin = {
    name: 'name',
    configuration: {
      input: {
        label: 'Input',
        type: 'input'
      },
      password: {
        label: 'Password',
        type: 'password'
      },
      select: {
        label: 'Select',
        type: 'select',
        options: ['option1', 'option2']
      },
      other: {
        label: 'Other',
        type: 'other'
      }
    }
  }
  const swr = {
    addOnePlugin: jest.fn(),
    mutateOnePlugin: jest.fn()
  }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div role="Dialog" />)

    mockError.mockReset()

    mockAdd.mockReset()
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation(({ onCancel }) => (
      <div onClick={onCancel} role="Dialog" />
    ))

    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onFinish', async () => {
    mockDialog.mockImplementation(({ onOk }) => (
      <div onClick={onOk} role="Dialog" />
    ))

    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')

    // // Error
    // mockAdd.mockImplementation(() => {
    //   throw new Error()
    // })
    // fireEvent.click(dialog, {
    //   target: {
    //     value: {
    //       input: 'input',
    //       password: 'password',
    //       select: 'option1'
    //     }
    //   }
    // })
    // await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    // await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
    // await wrapper
    //   .find('Dialog')
    //   .props()
    //   .onOk({ input: 'input', password: 'password', select: 'option1' })
    // expect(mockAdd).toHaveBeenCalledTimes(1)
    // expect(mockError).toHaveBeenCalledTimes(0)

    // // With plugin items
    // wrapper.unmount()
    // wrapper = shallow(
    //   <PluginDialog
    //     plugin={{ ...plugin, logo: 'logo', renderer: 'renderer' }}
    //     swr={swr}
    //   />
    // )
    // await wrapper
    //   .find('Dialog')
    //   .props()
    //   .onOk({ input: 'input', password: 'password', select: 'option1' })
    // expect(mockAdd).toHaveBeenCalledTimes(2)
    // expect(mockError).toHaveBeenCalledTimes(0)

    // // Error
    // mockAdd.mockImplementation(() => {
    //   throw new Error()
    // })
    // await wrapper
    //   .find('Dialog')
    //   .props()
    //   .onOk({ input: 'input', password: 'password', select: 'option1' })
    // expect(mockAdd).toHaveBeenCalledTimes(3)
    // expect(mockError).toHaveBeenCalledTimes(1)
  })

  // test('edit', async () => {
  //   wrapper.unmount()

  //   wrapper = shallow(<PluginDialog plugin={plugin} swr={swr} edit={true} />)
  //   expect(wrapper).toBeDefined()

  //   await wrapper
  //     .find('Dialog')
  //     .props()
  //     .onOk({ input: 'input', password: 'password', select: 'option1' })
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<PluginDialog plugin={plugin} swr={swr} />)
  // // })
})
