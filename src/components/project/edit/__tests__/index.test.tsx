import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import Edit, { errors } from '..'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
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
    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit project={project} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Edit project={project} swr={swr} />)

    const button = screen.getByRole('EditButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onEdit', async () => {
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
    const { unmount } = render(<Edit project={project} swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Normal
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateOneProject).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.edit,
        new Error('update error')
      )
    )

    unmount()
  })

  test('keyup', () => {
    mockDialog.mockImplementation((props) => <Form>{props.children}</Form>)
    const { unmount } = render(<Edit project={project} swr={swr} />)

    const textarea = screen.getByRole('textbox', { name: 'Description' })
    fireEvent.keyUp(textarea)

    unmount()
  })
})
