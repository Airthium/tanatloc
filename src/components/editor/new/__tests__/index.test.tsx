import { fireEvent, render, screen } from '@testing-library/react'
import New from '..'

describe('component/editor/new', () => {
  test('render', () => {
    const { unmount } = render(<New />)

    unmount()
  })

  test('onNew', () => {
    const { unmount } = render(<New />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })
})
