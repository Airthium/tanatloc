import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Validation from '@/pages/signup/validation'
import { REVALIDATE } from '@/config/email'

// Next/router mock
const mockRouterPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (route) => mockRouterPush(route),
    query: mockQuery()
  })
}))

// Fetch mock
const mockFetch = jest.fn()
global.fetch = (route, params) => mockFetch(route, params)

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/frontend/signup/validation', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('render, no id', () => {
    const { unmount } = render(<Validation />)

    screen.getByText('No link identifier detected')

    unmount()
  })

  test('render, id', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch
      .mockImplementationOnce(() => ({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        json: () => ({ type: REVALIDATE })
      }))
      .mockImplementationOnce(() => ({
        ok: true,
        status: 200,
        headers: {
          get: () => ''
        }
      }))
    const { unmount } = render(<Validation />)

    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenLastCalledWith('/login')
    )

    unmount()
  })

  test('bad type', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch.mockImplementationOnce(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ type: 'Unknown' })
    }))
    const { unmount } = render(<Validation />)

    await waitFor(() => screen.getByText('Wrong link'))

    unmount()
  })

  test('Link error', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch.mockImplementationOnce(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    const { unmount } = render(<Validation />)

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    unmount()
  })

  test('Link error 2', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch
      .mockImplementationOnce(() => ({
        ok: true,
        type: REVALIDATE,
        headers: {
          get: () => ''
        }
      }))
      .mockImplementationOnce(() => ({
        ok: false,
        headers: {
          get: () => ''
        }
      }))
    const { unmount } = render(<Validation />)

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    unmount()
  })
})
