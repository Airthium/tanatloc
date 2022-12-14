import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import { IClientPlugin } from '@/plugins/index.d'

import Edit, { errors } from '..'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: () => mockPasswordItem()
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockUpdateById = jest.fn()
jest.mock('@/api/user', () => ({
  updateById: async () => mockUpdateById()
}))

describe('components/administration/users/edit', () => {
  const plugins: IClientPlugin[] = []
  const user = {
    id: 'id',
    email: 'email',
    authorizedplugins: [],
    superuser: false
  }
  const swr = { mutateOneUser: jest.fn() }

  beforeEach(() => {
    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockUpdateById.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit plugins={plugins} user={user} swr={swr} />)

    unmount()
  })

  test('ref', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(<Edit plugins={plugins} user={user} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Edit plugins={plugins} user={user} swr={swr} />)

    const button = screen.getByRole('EditButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onUpdate', async () => {
    let returned = {}
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk(returned)
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Edit
        plugins={[...plugins, { key: 'key', name: 'name' }]}
        user={user}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    returned = {
      firstname: 'firstname',
      lastname: undefined,
      password: 'password',
      key: '******'
    }
    fireEvent.click(dialog)
    await act(async () =>
      waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(1))
    )
    await waitFor(() => expect(swr.mutateOneUser).toHaveBeenCalledTimes(1))

    // Empty
    returned = {}
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneUser).toHaveBeenCalledTimes(1))

    // Error
    returned = {
      firstname: 'other firstname'
    }
    mockUpdateById.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(dialog)
    await act(async () =>
      waitFor(() => expect(mockUpdateById).toHaveBeenCalledTimes(2))
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })
})
