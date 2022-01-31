import React from 'react'
import { render } from '@testing-library/react'

import Welcome from '@/components/dashboard/welcome'

jest.mock('@/components/workspace/add', () => () => <div />)

describe('components/dashboard/welcome', () => {
  const swr = {
    addOneWorkspace: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(<Welcome swr={swr} />)

    unmount()
  })
})
