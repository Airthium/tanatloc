import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

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
jest.mock('swr', () => (route) => mockSWR(route))

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

describe('e2e/frontend/dashboard/account/password', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({ tab: 'hpc' }))

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: {
        user: { id: 'id', email: 'email', authorizedplugins: [] },
        organizations: null,
        workspaces: null,
        plugins: null
      },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => []
    }))

    mockCaptureException.mockReset()
  })

  test('render', async () => {
    const { unmount } = render(<Dashboard />)

    await waitFor(() =>
      screen.getByText('You do not have access to any HPC plugin. Request it.')
    )

    unmount()
  })

  // test('render, with authorized plugins, loading', () => {
  //   mockSWR.mockImplementation((route) => {
  //     if (route === '/api/plugin')
  //       return {
  //         error: null,
  //         mutate: jest.fn
  //       }
  //     else
  //       return {
  //         data: {
  //           user: {
  //             id: 'id',
  //             email: 'email',
  //             authorizedplugins: ['local']
  //           },
  //           organizations: null,
  //           workspaces: null
  //         },
  //         error: null,
  //         mutate: jest.fn
  //       }
  //   })

  //   const { unmount } = render(<Dashboard />)

  //   unmount()
  // })

  // test('render, with authorized plugins, error', async () => {
  //   mockSWR.mockImplementation((route) => {
  //     if (route === '/api/plugin')
  //       return {
  //         data: { plugins: null },
  //         error: new Error('SWR error'),
  //         mutate: jest.fn
  //       }
  //     else
  //       return {
  //         data: {
  //           user: {
  //             id: 'id',
  //             email: 'email',
  //             authorizedplugins: ['local']
  //           },
  //           organizations: null,
  //           workspaces: null
  //         },
  //         error: null,
  //         mutate: jest.fn
  //       }
  //   })

  //   const { unmount } = render(<Dashboard />)

  //   await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(2))

  //   unmount()
  // })

  // test('render, with plugins', () => {
  //   mockSWR.mockImplementation(() => ({
  //     data: {
  //       user: {
  //         id: 'id',
  //         email: 'email',
  //         authorizedplugins: ['local']
  //       },
  //       organizations: null,
  //       workspaces: null,
  //       plugins: [
  //         {
  //           uuid: 'uuid1',
  //           category: 'HPC',
  //           key: 'local',
  //           name: 'Local',
  //           description: '<p>Local</p>',
  //           configuration: {
  //             name: {
  //               label: 'Name',
  //               type: 'input',
  //               value: 'Name'
  //             }
  //           }
  //         }
  //       ]
  //     },
  //     error: null,
  //     mutate: jest.fn
  //   }))

  //   const { unmount } = render(<Dashboard />)

  //   unmount()
  // })
})
