import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import NotFound from '@/components/notfound'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockRouter()
  })
}))

describe('components/notfound', () => {
  beforeEach(() => {
    mockRouter.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<NotFound />)

    unmount()
  })

  test('onClick', () => {
    const { unmount } = render(<NotFound />)

    const button = screen.getByRole('heading', { name: 'Come back home' })
    fireEvent.click(button)

    expect(mockRouter).toHaveBeenCalledTimes(1)

    unmount()
  })
})
