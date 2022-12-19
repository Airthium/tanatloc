import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import PluginDialog, { errors } from '..'

const mockAddButton = jest.fn()
const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props),
  EditButton: (props: any) => mockEditButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/plugin', () => ({
  add: async (add: any) => mockAdd(add),
  update: async (update: any) => mockUpdate(update)
}))

describe('components/account/hpc/plugin/dialog', () => {
  const plugin = {
    key: 'key',
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
      textarea: {
        label: 'Textarea',
        type: 'textarea',
        default: 'Default'
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
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockAdd.mockReset()
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)

    unmount()
  })

  test('ref', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)

    unmount()
  })

  test('without first input', () => {
    const { unmount } = render(
      <PluginDialog
        plugin={{
          ...plugin,
          configuration: {
            password: {
              label: 'Password',
              type: 'password'
            },
            input: {
              label: 'Input',
              type: 'input'
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('setVisible and cancel', () => {
    mockAddButton.mockImplementation(({ onAdd }) => (
      <div role="AddButton" onClick={onAdd} />
    ))
    mockDialog.mockImplementation(({ onCancel }) => (
      <div onClick={onCancel} role="Dialog" />
    ))
    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)

    const button = screen.getByRole('AddButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onFinish', () => {
    mockDialog.mockImplementation(({ onOk }) => (
      <div
        onClick={async () => {
          try {
            await onOk({
              input: 'inputValue',
              password: 'passwordValue',
              select: 'selectValue'
            })
          } catch (err) {}
        }}
        role="Dialog"
      />
    ))

    const { unmount } = render(<PluginDialog plugin={plugin} swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(dialog)
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockAdd).toHaveBeenLastCalledWith({
        ...plugin,
        configuration: {
          ...plugin.configuration,
          input: {
            ...plugin.configuration.input,
            value: 'inputValue'
          },
          password: {
            ...plugin.configuration.password,
            value: 'passwordValue'
          },
          select: {
            ...plugin.configuration.select,
            value: 'selectValue'
          }
        }
      })
    )
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('add error')
      )
    )

    // Normal
    mockAdd.mockImplementation(() => {
      // mock function
    })
    fireEvent.click(dialog)
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    waitFor(() => expect(swr.addOnePlugin).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('edit', () => {
    mockEditButton.mockImplementation(({ onEdit }) => (
      <div role="EditButton" onClick={onEdit} />
    ))
    mockDialog.mockImplementation(({ onOk }) => (
      <div
        onClick={async () => {
          try {
            await onOk({
              input: 'inputValue2',
              password: 'passwordValue2',
              select: 'selectValue2'
            })
          } catch (err) {}
        }}
        role="Dialog"
      />
    ))
    const { unmount } = render(
      <PluginDialog plugin={plugin} swr={swr} edit={true} />
    )

    const editButton = screen.getByRole('EditButton')
    fireEvent.click(editButton)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith({
        ...plugin,
        configuration: {
          ...plugin.configuration,
          input: {
            ...plugin.configuration.input,
            value: 'inputValue2'
          },
          password: {
            ...plugin.configuration.password,
            value: 'passwordValue2'
          },
          select: {
            ...plugin.configuration.select,
            value: 'selectValue2'
          }
        },
        needReInit: true
      })
    )
    waitFor(() => expect(swr.mutateOnePlugin).toHaveBeenCalledTimes(1))

    unmount()
  })
})
