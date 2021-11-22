import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import HPC from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  list: async () => mockList()
}))

jest.mock('../plugin', () => () => <div role="Plugin" />)

describe('components/account/hpc', () => {
  const user = {
    authorizedplugins: []
  }

  beforeEach(() => {
    mockError.mockReset()

    mockList.mockReset()
    mockList.mockImplementation(() => [])
  })

  test('render', async () => {
    const { unmount } = render(<HPC user={user} />)

    await waitFor(() =>
      screen.getByText('You do not have access to any HPC plugin. Request it.')
    )

    unmount()
  })

  test('plugins error', async () => {
    mockList.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<HPC user={user} />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with plugins', async () => {
    mockList.mockImplementation(() => [
      {
        key: 'plugin',
        name: 'Plugin',
        category: 'HPC',
        configuration: {}
      }
    ])
    const { unmount } = render(
      <HPC user={{ ...user, authorizedplugins: ['plugin'] }} />
    )

    await waitFor(() => screen.getByRole('Plugin'))

    unmount()
  })
})
