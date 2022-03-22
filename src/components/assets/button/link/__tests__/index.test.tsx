import { fireEvent, render, screen } from '@testing-library/react'

import LinkButton from '..'

describe('components/assets/button/link', () => {
  const onClick = jest.fn()
  test('render', () => {
    const { unmount } = render(<LinkButton onClick={onClick}>Link</LinkButton>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)

    unmount()
  })
})
