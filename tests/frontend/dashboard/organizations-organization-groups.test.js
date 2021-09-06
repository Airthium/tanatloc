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
    return 'organizations'
  }
}))

describe('e2e/frontend/dashboard/organizations', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: null,
        organizations: [
          {
            id: 'id1',
            name: 'Organization 1',
            owners: [
              {
                id: 'id',
                email: 'owner'
              }
            ],
            users: [
              {
                id: 'id_user',
                email: 'user'
              }
            ],
            groups: [
              {
                id: 'id_group',
                name: 'Group 1',
                users: [
                  {
                    id: 'id1',
                    email: 'email'
                  },
                  {
                    id: 'id2',
                    email: 'email',
                    firstname: 'firstname'
                  }
                ]
              }
            ]
          },
          {
            id: 'id2',
            name: 'Organization 2',
            owners: [
              {
                id: 'id',
                email: 'owner'
              }
            ],
            users: [],
            groups: []
          }
        ],
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('onName', async () => {
    const { unmount } = render(<Dashboard />)

    // Set organization
    const org = screen.getAllByRole('button', { name: 'control Manage' })[0]
    fireEvent.click(org)

    // Set groups
    const tab = screen.getByRole('tab', { name: 'Groups' })
    fireEvent.click(tab)

    // Add
    const add = screen.getByRole('button', { name: 'plus New group' })
    fireEvent.click(add)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(add)

    // Form
    const name = screen.getByRole('textbox', { name: 'Name' })
    const users = screen.getByRole('combobox', { name: 'Users' })
    const ok = screen.getByRole('button', { name: 'OK' })

    fireEvent.change(name, { target: { value: 'Group name' } })
    fireEvent.change(users, { target: { value: 'id' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    // fireEvent.click(ok)
    // await waitFor(() =>
    //   expect(mockCaptureException).toHaveBeenLastCalledWith(new Error(''))
    // )

    // TODO

    unmount()
  })
})
