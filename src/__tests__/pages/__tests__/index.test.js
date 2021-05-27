import React from 'react'
import { render } from '@testing-library/react'

import Index from '@/pages/index'

jest.mock('@/components/index/index', () => 'index')

describe('pages/index', () => {
  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })
})
