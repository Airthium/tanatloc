import { fireEvent, render, screen } from '@testing-library/react'
import Dimension from '..'

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/dimension', () => {
  test('render', () => {
    const { unmount } = render(<Dimension />)

    unmount()
  })

  test('onAdd', () => {
    const { unmount } = render(<Dimension />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })
})
