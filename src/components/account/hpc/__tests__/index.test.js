import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import HPC from '..'

jest.mock('../plugin', () => () => <div role="Plugin" />)

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  list: async () => mockList()
}))

describe('components/account/hpc', () => {
  const user = {
    authorizedplugins: []
  }

  beforeEach(() => {
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
