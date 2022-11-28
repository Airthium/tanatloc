import { fireEvent, render, screen } from '@testing-library/react'

import GoBack from '@/components/assets/button/goBack'

describe('components/assets/button/goBack', () => {
  const mockOnClick = jest.fn()

  test('render', () => {
    const { unmount } = render(<GoBack onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)

    unmount()
  })
})
