import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Information from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
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

  test('onFinish', async () => {
    const { unmount } = render(<Information user={user} swr={swr} />)
    const button = screen.getByRole('button', { name: 'Apply changes' })

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Fill form
    const email = screen.getByLabelText('Email')
    const firstName = screen.getByLabelText('First name')
    const lastName = screen.getByLabelText('Last name')

    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(firstName, { target: { value: 'first name' } })
    fireEvent.change(lastName, { target: { value: 'last name' } })

    // Normal
    mockUpdate.mockImplementation(() => {})
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onCancel', () => {
    const { unmount } = render(<Information user={user} swr={swr} />)
    const button = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(button)

    unmount()
  })

  test('upload', async () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    const upload = screen.getByRole('img', { name: 'upload' })

    // Wrong format
    let file = new File(['buffer'], 'file.png', { type: 'application/mesh' })
    fireEvent.drop(upload, {
      dataTransfer: {
        files: [file]
      }
    })

    // Wrong size
    file = new File([Buffer.alloc(5 * 1024 * 1024)], 'file.png', {
      type: 'application/mesh'
    })
    fireEvent.drop(upload, {
      dataTransfer: {
        files: [file]
      }
    })

    // Good format
    file = new File(['buffer'], 'file.png', { type: 'image/png' })
    fireEvent.drop(upload, {
      dataTransfer: {
        files: [file]
      }
    })

    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    unmount()
  })

  it('upload - error', async () => {
    const { unmount } = render(<Information user={user} swr={swr} />)

    const upload = screen.getByRole('img', { name: 'upload' })

    // Avatar error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    const file = new File(['buffer'], 'file.png', { type: 'image/png' })
    fireEvent.drop(upload, {
      dataTransfer: {
        files: [file]
      }
    })
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
