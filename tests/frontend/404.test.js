import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import _404 from '@/pages/404'

// Next/router mock
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (route) => mockRouterPush(route)
  })
}))

describe('e2e/frontend/404', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<_404 />)

    unmount()
  })

  test('home', () => {
    const { unmount } = render(<_404 />)

    const back = screen.getByRole('heading', { name: 'Come back home' })
    fireEvent.click(back)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/')

    unmount()
  })
})
