import React from 'react'
import { render, screen } from '@testing-library/react'

import MathJax from '..'

jest.mock('@/lib/mathjax', () => ({
  mathjaxInit: jest.fn,
  mathjaxRefresh: jest.fn
}))

jest.mock('html-react-parser', () => (html) => 'parsed ' + html)

describe('components/assets/mathjax', () => {
  test('Head', () => {
    const { unmount } = render(<MathJax.Head />)

    unmount()
  })

  test('Inline - empty', () => {
    const { unmount } = render(<MathJax.Inline text={''} />)

    unmount()
  })

  test('Inline - with tags', () => {
    const { unmount } = render(<MathJax.Inline text={'\\(test\\)'} />)

    screen.getByText('\\(test\\)')

    unmount()
  })

  test('Inline - without tags', () => {
    const { unmount } = render(<MathJax.Inline text={'test'} />)

    screen.getByText('\\(test\\)')

    unmount()
  })

  test('Formula - empty', () => {
    const { unmount } = render(<MathJax.Formula text={''} />)

    unmount()
  })

  test('Formula - with tags', () => {
    const { unmount } = render(<MathJax.Formula text={'$$test$$'} />)

    screen.getByText('$$test$$')

    unmount()
  })

  test('Formula - without tags', () => {
    const { unmount } = render(<MathJax.Formula text={'test'} />)

    screen.getByText('$$test$$')

    unmount()
  })

  test('Html - empty', () => {
    const { unmount } = render(<MathJax.Html html={''} />)

    unmount()
  })

  test('Html', () => {
    const { unmount } = render(<MathJax.Html html={'html'} />)

    screen.getByText('parsed html')

    unmount()
  })
})
