import React from 'react'
import { render } from '@testing-library/react'

import Start from '..'

jest.mock('../../loading', () => () => <div />)

const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockQuery()
  })
}))

describe('components/start', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Start />)

    unmount()
  })

  test('status, err', () => {
    mockQuery.mockImplementation(() => ({ status: 'status', err: 'error' }))
    const { unmount } = render(<Start />)

    unmount()
  })
})
