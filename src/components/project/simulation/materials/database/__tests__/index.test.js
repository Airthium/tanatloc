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

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const metal = screen.getByRole('menuitem', { name: 'Metal' })
    fireEvent.click(metal)

    const open = screen.getByRole('button', { name: 'select' })
    fireEvent.click(open)

    unmount()
  })
})
