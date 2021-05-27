import React from 'react'
import { render } from '@testing-library/react'

import Login from '@/pages/login'

jest.mock('@/components/login', () => 'login')

describe('pages/login', () => {
  test('render', () => {
    const { unmount } = render(<Login />)

    unmount()
  })
})
