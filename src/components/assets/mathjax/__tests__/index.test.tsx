import { render, screen, waitFor } from '@testing-library/react'

import MathJax from '..'

jest.mock('@/lib/mathjax', () => ({
  mathjaxInit: jest.fn,
  mathjaxRefresh: jest.fn
}))

jest.mock(
  'html-react-parser',
  () =>
    (html: string): string =>
      'parsed ' + html
)

describe('components/assets/mathjax', () => {
  test('Head', () => {
    const { unmount } = render(<MathJax.Head />)

    unmount()
  })

  test('BackInline - empty', () => {
    const { unmount } = render(<MathJax.BackInline />)

    unmount()
  })

  test('BackInline - with tags', () => {
    const { unmount } = render(<MathJax.BackInline text={'\\(test\\)'} />)

    unmount()
  })

  test('BackInline - without tags', () => {
    const { unmount } = render(<MathJax.BackInline text={'test'} />)

    screen.getByText('\\(test\\)')

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

  test('BackFormula - empty', () => {
    const { unmount } = render(<MathJax.BackFormula />)

    unmount()
  })

  test('BackFormula - with tags', () => {
    const { unmount } = render(<MathJax.BackFormula text={'$$test$$'} />)

    screen.getByText('$$test$$')

    unmount()
  })

  test('BackFormula - without tags', () => {
    const { unmount } = render(<MathJax.BackFormula text={'test'} />)

    screen.getByText('$$test$$')

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

  test('Html', async () => {
    const { unmount } = render(<MathJax.Html html={'html'} />)

    await waitFor(() => screen.getByText('parsed html'))

    unmount()
  })
})
