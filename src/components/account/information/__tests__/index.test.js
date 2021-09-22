import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Information from '..'

const mockUpload = jest.fn()
jest.mock('antd/lib/upload', () => (props) => mockUpload(props))

const mockSuccess = jest.fn()
const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Success: () => mockSuccess(),
  Error: () => mockError()
}))

const mockValidate = jest.fn()
jest.mock('@/lib/utils', () => ({
  validateEmail: () => mockValidate()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: async () => mockUpdate()
}))

const mockAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAdd()
}))

global.FileReader = class {
  addEventListener(_, callback) {
    callback()
  }
  readAsDataURL() {
    // mock method
  }
  result = 'img'
}

describe('components/account/information', () => {
  const user = { email: 'email' }
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockUpload.mockReset()
    mockUpload.mockImplementation(() => <div />)

    mockSuccess.mockReset()
    mockError.mockReset()

    mockValidate.mockReset()

    mockUpdate.mockReset()

    mockAdd.mockReset()

    swr.mutateUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    unmount()
  })

  test('with avatar', () => {
    const { unmount } = render(
      <Information
        user={{ ...user, avatar: { type: 'Buffer', data: [] } }}
        swr={swr}
      />
    )

    unmount()
  })

  test('onEmail', async () => {
    let textbox
    let buttons

    const { unmount } = render(<Information user={user} swr={swr} />)

    // Invalid email
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[0])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'email' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockValidate.mockImplementation(() => true)
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[0])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'email' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[0])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'email' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('onFirstName', async () => {
    let textbox
    let buttons

    const { unmount } = render(<Information user={user} swr={swr} />)

    // Normal
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[1])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'firstname' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[1])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'firstname' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onLastName', async () => {
    let textbox
    let buttons

    const { unmount } = render(<Information user={user} swr={swr} />)

    // Normal
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[2])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'lastname' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    buttons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(buttons[2])
    textbox = screen.getByRole('textbox')
    fireEvent.change(textbox, { target: { value: 'lastname' } })
    fireEvent.keyDown(textbox, { keyCode: 13 })
    fireEvent.keyUp(textbox, { keyCode: 13 })
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('beforeUpload', async () => {
    let file
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        onClick={(e) => props.beforeUpload(e.target.files[0])}
      />
    ))

    const { unmount } = render(<Information user={user} swr={swr} />)

    const upload = screen.getByRole('Upload')

    // Wrong format
    file = new File(['buffer'], 'file.png', { type: 'application/mesh' })
    fireEvent.click(upload, { target: { files: [file] } })
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Wrong size
    file = new File([Buffer.alloc(5 * 1024 * 1024)], 'file.png', {
      type: 'image/png'
    })
    fireEvent.click(upload, { target: { files: [file] } })
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(2))

    // Good format
    file = new File(['buffer'], 'file.png', { type: 'image/png' })
    fireEvent.click(upload, { target: { files: [file] } })

    unmount()
  })

  test('onChange', async () => {
    let info
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        onClick={async (e) => {
          props.onChange(JSON.parse(e.target.value))
        }}
      />
    ))

    const { unmount } = render(<Information user={user} swr={swr} />)

    const upload = screen.getByRole('Upload')

    // Uploading
    info = { file: { status: 'uploading' } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })

    // Done
    info = { file: { status: 'done', originFileObj: {} } }
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(upload, { target: { value: JSON.stringify(info) } })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
