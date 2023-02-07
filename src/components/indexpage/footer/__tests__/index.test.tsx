import { fireEvent, render, screen } from '@testing-library/react'

import Footer from '..'

const mockGitVersion = jest.fn()
jest.mock('@/lib/utils', () => ({
  getGitVersion: () => mockGitVersion()
}))

//@ts-ignore
window.open = jest.fn

describe('components/indexpage/footer', () => {
  const scroll = jest.fn()

  beforeEach(() => {
    mockGitVersion.mockReset()
    mockGitVersion.mockImplementation(() => 'git-version')
  })

  test('render', () => {
    const { unmount } = render(<Footer scroll={scroll} />)

    unmount()
  })

  test('without git version', () => {
    mockGitVersion.mockImplementation(() => undefined)
    const { unmount } = render(<Footer scroll={scroll} />)

    unmount()
  })

  test('scroll', () => {
    const { unmount } = render(<Footer scroll={scroll} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(scroll).toHaveBeenCalledTimes(buttons.length - 5)

    unmount()
  })
})
