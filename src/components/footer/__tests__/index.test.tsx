import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Footer from '..'

describe('components/footer', () => {
  const scroll = jest.fn()

  test('render', () => {
    const { unmount } = render(<Footer scroll={scroll} />)

    unmount()
  })

  test('scroll', () => {
    const { unmount } = render(<Footer scroll={scroll} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(scroll).toHaveBeenCalledTimes(buttons.length - 2)

    unmount()
  })
})
