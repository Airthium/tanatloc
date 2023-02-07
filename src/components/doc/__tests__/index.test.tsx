import { fireEvent, render, screen } from '@testing-library/react'

import Doc from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery()
  })
}))

jest.mock('@/lib/utils', () => ({
  getGitVersion: () => 'git-version'
}))

jest.mock('../installation', () => () => <div />)
jest.mock('../changelog', () => () => <div />)
jest.mock('../workflow', () => () => <div />)
jest.mock('../dashboard', () => () => <div />)
jest.mock('../project', () => () => <div />)
jest.mock('../editor', () => () => <div />)
jest.mock('../plugins', () => () => <div />)

describe('components/doc', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Doc />)

    unmount()
  })

  test('onTanatloc', () => {
    const { unmount } = render(<Doc />)

    const button = screen.getAllByRole('img', { name: 'Tanatloc' })[0]
    fireEvent.click(button)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenLastCalledWith('/')

    unmount()
  })

  test('onMenuClick', () => {
    const { unmount } = render(<Doc />)

    const items = screen.getAllByRole('menuitem')
    items.forEach((item) => fireEvent.click(item))

    unmount()
  })

  test('with query', () => {
    const { unmount, rerender } = render(<Doc />)

    mockQuery.mockImplementation(() => ({ section: 'dashboard' }))
    rerender(<Doc />)

    unmount()
  })
})
