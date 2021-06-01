import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import NotAuthorized from '@/components/notauthorized'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

describe('components/notfound', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<NotAuthorized />)
    expect(mockPrefetch).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('goBack', () => {
    const { unmount } = render(<NotAuthorized />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })
})
