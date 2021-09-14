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
    key: 'key',
    name: 'name',
    logo: 'logo',
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
      <div
        onClick={async () => {
          try {
            await onOk({
              input: 'input',
              password: 'password',
              select: 'option1'
            })
          } catch (err) {}
        }}
        role="Dialog"
      />
    ))

    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockAdd.mockImplementation(() => {
      // mock function
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.addOnePlugin).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('edit', async () => {
    mockDialog.mockImplementation(({ onOk }) => (
      <div
        onClick={async () => {
          try {
            await onOk({
              input: 'input',
              password: 'password',
              select: 'option2'
            })
          } catch (err) {}
        }}
        role="Dialog"
      />
    ))
    const { unmount } = render(
      <PluginDialog plugin={plugin} swr={swr} edit={true} />
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOnePlugin).toHaveBeenCalledTimes(1))

    unmount()
  })
})
