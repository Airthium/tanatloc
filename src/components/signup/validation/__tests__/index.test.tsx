import React from 'react'
import { render, waitFor } from '@testing-library/react'

import Validation from '..'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockLinkGet = jest.fn()
const mockLinkProcess = jest.fn()
jest.mock('@/api/link', () => ({
  get: async () => mockLinkGet(),
  process: async () => mockLinkProcess()
}))

describe('components/signup/validation', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockRouter.mockImplementation(() => ({
      query: {}
    }))

    mockError.mockReset()

    mockLinkGet.mockReset()
    mockLinkGet.mockImplementation(() => ({}))
    mockLinkProcess.mockReset()
  })
  test('render', () => {
    const { unmount } = render(<Validation />)

    unmount()
  })

  test('render with id', async () => {
    mockRouter.mockImplementation(() => ({
      query: { id: 'id' }
    }))
    const { unmount } = render(<Validation />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('correct type', async () => {
    const mockPush = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: () => mockPush(),
      query: { id: 'id' }
    }))
    mockLinkGet.mockImplementation(() => ({ type: 'subscribe' }))
    const { unmount } = render(<Validation />)

    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('get error', async () => {
    const mockPush = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: () => mockPush(),
      query: { id: 'id' }
    }))
    mockLinkGet.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<Validation />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('process error', async () => {
    const mockPush = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: () => mockPush(),
      query: { id: 'id' }
    }))
    mockLinkGet.mockImplementation(() => ({
      type: 'subscribe'
    }))
    mockLinkProcess.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<Validation />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
