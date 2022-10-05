import { fireEvent, render, screen } from '@testing-library/react'

import Header from '..'

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/header', () => {
  test('render', () => {
    const { unmount } = render(<Header />)

    unmount()
  })

  test('onAdd', () => {
    const { unmount } = render(<Header />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })
})
