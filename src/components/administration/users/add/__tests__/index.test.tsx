import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import Add, { errors } from '..'
import { ClientPlugin } from '@/plugins/index.d'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props: any) => mockPasswordItem(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockAdd = jest.fn()
const mockUpdateById = jest.fn()
jest.mock('@/api/user', () => ({
  add: async () => mockAdd(),
  updateById: async () => mockUpdateById()
}))

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

describe('components/administration/users/add', () => {
  const plugins: ClientPlugin[] = []
  const swr = { addOneUser: jest.fn() }

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockAdd.mockReset()
    mockUpdateById.mockReset()

    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Add plugins={plugins} swr={swr} />)

    unmount()
  })

  test('ref', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(<Add plugins={plugins} swr={swr} />)

    unmount()
  })

  test('with defaultplugins', () => {
    mockSystem.mockImplementation(() => ({ defaultplugins: [] }))
    const { unmount } = render(<Add plugins={plugins} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Add plugins={plugins} swr={swr} />)

    const button = screen.getByRole('AddButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', async () => {
    mockAdd.mockImplementation(() => ({ alreadyExists: true }))
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({})
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Add
        plugins={[...plugins, { key: 'key', name: 'name' } as ClientPlugin]}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Already exists
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('User already exists')
      )
    )

    // Not exists
    mockAdd.mockImplementation(() => ({}))
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneUser).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('add error')
      )
    )

    unmount()
  })
})
