import { fireEvent, render, screen } from '@testing-library/react'

import NotAuthorized, { errors } from '@/components/notauthorized'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

describe('components/notfound', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<NotAuthorized />)

    screen.getByText(errors.notAllowed)

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
