import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Welcome from '@/components/dashboard/welcome'

jest.mock('@/components/workspace/add', () => () => <div />)

describe('components/dashboard/welcome', () => {
  const swr = {
    addOneWorkspace: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(<Welcome swr={swr} />)

    unmount()
  })

  test('add', () => {
    const { unmount } = render(<Welcome swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })
})
