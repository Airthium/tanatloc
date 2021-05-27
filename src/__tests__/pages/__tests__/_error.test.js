import React from 'react'
import { render } from '@testing-library/react'

import Error from '@/pages/_error'

jest.mock('@/components/error', () => 'error')

describe('pages/_error', () => {
  test('render', () => {
    const { unmount } = render(<Error />)

    unmount()
  })
})
