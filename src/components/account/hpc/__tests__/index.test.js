import React from 'react'
import { render, screen } from '@testing-library/react'

import HPC from '..'

jest.mock('@/components/account/hpc/plugin', () => {
  const Plugin = () => <div />
  return Plugin
})

jest.mock('@/plugins', () => ({
  NonHPCPlugin: {
    category: 'Other'
  },
  TestPlugin: {
    category: 'HPC',
    key: 'plugin',
    name: 'Test plugin'
  },
  TestUnauthorizedPlugin: {
    category: 'HPC',
    key: 'unauthorized',
    name: 'Unauthorized'
  }
}))

describe('components/account/hpc', () => {
  const user = {
    authorizedplugins: []
  }

  test('render', () => {
    const { unmount } = render(<HPC user={user} />)

    unmount()
  })

  test('with authorized plugins', () => {
    const { unmount } = render(
      <HPC user={{ ...user, authorizedplugins: ['plugin'] }} />
    )

    unmount()
  })
})
