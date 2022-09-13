import React from 'react'
import { render } from '@testing-library/react'

import Start from '..'

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: ''
  })
}))

describe('components/start', () => {
  test('render', () => {
    const { unmount } = render(<Start />)

    unmount()
  })
})
