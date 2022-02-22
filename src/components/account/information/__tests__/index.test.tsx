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

const mockUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: async () => mockUpdate()
}))

const mockAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAdd()
}))

Object.defineProperty(global, 'FileReader', {
  value: class {
    addEventListener(_, callback) {
      callback()
    }
    readAsDataURL() {
      // mock method
    }
    result = 'img'
  }
})

describe('components/account/information', () => {
  const user = {
    email: 'test@tanatloc.com',
    firstname: 'firstname',
    lastname: 'lastname'
  }
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockUpload.mockReset()
    mockUpload.mockImplementation(() => <div />)

    mockSuccess.mockReset()
    mockError.mockReset()

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
        user={{ ...user, avatar: Buffer.from('buffer') }}
        swr={swr}
      />
    )

    unmount()
  })

  test('onEmail', async () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    const submit = screen.getByRole('button', { name: 'Save changes' })
    const email = screen.getByRole('textbox', { name: 'Email' })

    // Not changed
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).not.toHaveBeenCalled())

    // Diff
    fireEvent.change(email, { target: { value: 'test1@tanatloc.com' } })
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onFirstName', async () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    const submit = screen.getByRole('button', { name: 'Save changes' })
    const firstname = screen.getByRole('textbox', { name: 'First name' })

    // Not changed
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).not.toHaveBeenCalled())

    // Diff
    fireEvent.change(firstname, { target: { value: 'other' } })
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onLastName', async () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    const submit = screen.getByRole('button', { name: 'Save changes' })
    const lastname = screen.getByRole('textbox', { name: 'Last name' })

    // Not changed
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).not.toHaveBeenCalled())

    // Diff
    fireEvent.change(lastname, { target: { value: 'other' } })
    fireEvent.click(submit)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('beforeUpload', async () => {
    let file
    mockUpload.mockImplementation((props) => (
      <input
        role="Upload"
        //@ts-ignore
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
          //@ts-ignore
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
