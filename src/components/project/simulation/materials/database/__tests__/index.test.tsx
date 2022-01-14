import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DataBase from '@/components/project/simulation/materials/database'

describe('components/project/simulation/materials/database', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<DataBase onSelect={mockOnSelect} />)

    unmount()
  })

  test('setVisible', () => {
    const { unmount } = render(<DataBase onSelect={mockOnSelect} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    unmount()
  })

  test('menu', () => {
    const { unmount } = render(<DataBase onSelect={mockOnSelect} />)

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // First menu
    const metal = screen.getByRole('menuitem', { name: 'Metal' })
    fireEvent.click(metal)

    // Second menu
    const open = screen.getByRole('menuitem', { name: 'Steel' })
    fireEvent.click(open)

    // Choose
    const choose = screen.getByRole('button', { name: 'Choose' })
    fireEvent.click(choose)

    expect(mockOnSelect).toHaveBeenCalledTimes(1)

    unmount()
  })
})
