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

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Dashboard />)

    screen.getByText('You do not have access to any HPC plugin. Request it.')

    unmount()
  })

  test('render, with authorized plugins, loading', () => {
    mockSWR.mockImplementation((route) => {
      if (route === '/api/plugin')
        return {
          error: null,
          mutate: jest.fn
        }
      else
        return {
          data: {
            user: {
              id: 'id',
              email: 'email',
              authorizedplugins: ['local', 'rescale', 'denso']
            },
            organizations: null,
            workspaces: null
          },
          error: null,
          mutate: jest.fn
        }
    })

    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('render, with authorized plugins, error', async () => {
    mockSWR.mockImplementation((route) => {
      if (route === '/api/plugin')
        return {
          data: { plugins: null },
          error: new Error('SWR error'),
          mutate: jest.fn
        }
      else
        return {
          data: {
            user: {
              id: 'id',
              email: 'email',
              authorizedplugins: ['local', 'rescale', 'denso']
            },
            organizations: null,
            workspaces: null
          },
          error: null,
          mutate: jest.fn
        }
    })

    const { unmount } = render(<Dashboard />)

    await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('render, with plugins', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: ['local', 'rescale', 'denso']
        },
        organizations: null,
        workspaces: null,
        plugins: [
          {
            uuid: 'uuid1',
            category: 'HPC',
            key: 'local',
            name: 'Local',
            description: '<p>Local</p>',
            configuration: {
              name: {
                label: 'Name',
                type: 'input',
                value: 'Name'
              }
            }
          },
          {
            uuid: 'uuid2',
            category: 'HPC',
            key: 'rescale',
            name: 'Rescale plugin',
            logo: '/images/rescale.svg',
            description:
              '<p><a target="_blank" href="https://www.rescale.com/">Rescale</a>: Intelligent HPC Platform</p>',
            configuration: {
              name: {
                required: true,
                label: 'Name',
                type: 'input',
                value: 'Name'
              },
              token: {
                required: true,
                label: 'Token',
                type: 'password'
              },
              platform: {
                required: true,
                label: 'Platform',
                type: 'select',
                options: [
                  'platform.rescale.com',
                  'eu.rescale.com',
                  'platform.rescale.jp'
                ],
                value: 'platform.rescale.jp'
              },
              walltime: {
                label: 'Default walltime (hours)',
                type: 'input',
                default: '48'
              },
              organization: {
                label: 'Organization name',
                type: 'input'
              },
              project: {
                label: 'Project id',
                type: 'input'
              },
              additionalFiles: {
                label: 'Additional files (id1, id2, ...)',
                type: 'input'
              }
            }
          }
        ]
      },
      error: null,
      mutate: jest.fn
    }))

    const { unmount } = render(<Dashboard />)

    unmount()
  })
})
