import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Dashboard from '@/pages/dashboard'

// Next/router mock
const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    push: (route) => mockRouterPush(route),
    replace: (route) => mockRouterReplace(route),
    query: mockQuery()
  })
}))

// SWR mock
const mockSWR = jest.fn()
jest.mock('swr', () => () => mockSWR())

// Fetch mock
const mockFetch = jest.fn()
global.fetch = (route, params) => mockFetch(route, params)

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

// URLSearchParams mock
jest.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
  get: () => {
    return 'account'
  }
}))

const mockUpload = jest.fn()
jest.mock('antd/lib/upload', () => (props) => mockUpload(props))

describe('e2e/frontend/dashboard/account/information', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: {
        user: { id: 'id', email: 'email', authorizedplugins: [] },
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()

    mockUpload.mockReset()
    mockUpload.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('render, with avatar', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          avatar: Buffer.from('avatar'),
          email: 'email',
          authorizedplugins: []
        },
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('first name', async () => {
    const { unmount } = render(<Dashboard />)

    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ''
    }))

    // Open edit
    let edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[1])

    // Modify and enter
    let input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'firstname' } })
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ key: 'firstname', value: 'firstname' }])
      })
    )

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      status: 500,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ error: true, message: 'Server error' })
    }))

    edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[1])

    input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    unmount()
  })

  test('last name', async () => {
    const { unmount } = render(<Dashboard />)

    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ''
    }))

    // Open edit
    let edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[2])

    // Modify and enter
    let input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'lastname' } })
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ key: 'lastname', value: 'lastname' }])
      })
    )

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      status: 500,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ error: true, message: 'Server error' })
    }))

    edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[2])

    input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    unmount()
  })

  test('email', async () => {
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ''
    }))

    const { unmount } = render(<Dashboard />)

    // Open edit
    let edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[0])

    // Modify and enter
    let input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'email' } })
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Email address wrong format.')
      )
    )

    // Normal
    edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[0])

    input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'email@email.test' } })
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ key: 'email', value: 'email@email.test' }])
      })
    )

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      status: 500,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ error: true, message: 'Server error' })
    }))

    edits = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(edits[2])

    input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { keyCode: 13 })
    fireEvent.keyUp(input, { keyCode: 13 })

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

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

    const { unmount } = render(<Dashboard />)

    const upload = screen.getByRole('Upload')

    // Wrong format
    file = new File(['buffer'], 'file.png', { type: 'application/mesh' })
    fireEvent.click(upload, {
      target: {
        files: [file]
      }
    })

    // Wrong size
    file = new File([Buffer.alloc(5 * 1024 * 1024)], 'file.png', {
      type: 'image/png'
    })
    fireEvent.drop(upload, {
      target: {
        files: [file]
      }
    })

    // Good
    file = new File(['buffer'], 'file.png', { type: 'image/png' })
    fireEvent.drop(upload, {
      target: {
        files: [file]
      }
    })

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

    const { unmount } = render(<Dashboard />)

    const upload = screen.getByRole('Upload')

    mockFetch.mockImplementation(() => {
      return {
        ok: true,
        headers: {
          get: () => 'application/json'
        },
        json: () => ''
      }
    })

    // Uploading
    info = { file: { status: 'uploading' } }
    fireEvent.click(upload, {
      target: {
        value: JSON.stringify(info)
      }
    })

    // Done
    info = {
      file: { status: 'done', name: 'file.png', uid: 'uid', originFileObj: {} }
    }
    global.FileReader = class {
      addEventListener(_, callback) {
        callback()
      }
      readAsDataURL() {
        // mock method
      }
      result = 'img'
    }

    fireEvent.click(upload, {
      target: {
        value: JSON.stringify(info)
      }
    })

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/avatar', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: {
            name: 'file.png',
            uid: 'uid',
            data: 'img'
          }
        })
      })
    )

    unmount()
  })

  test('delete account', async () => {
    const { unmount } = render(<Dashboard />)

    // Open dialog
    const button = screen.getByRole('button', {
      name: 'delete Delete your account'
    })
    fireEvent.click(button)

    const del = screen.getByRole('button', { name: 'Delete' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })

    // Cancel
    fireEvent.click(cancel)
    fireEvent.click(button)

    // Error
    mockFetch.mockImplementation(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(del)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Fetch error')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ''
    }))
    fireEvent.click(del)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )
    await waitFor(() =>
      expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/logout', undefined)
    )

    unmount()
  })
})
