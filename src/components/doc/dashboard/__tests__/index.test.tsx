import { fireEvent, render, screen } from '@testing-library/react'

import Dashboard from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery()
  })
}))

jest.mock('../workspace', () => () => <div />)
jest.mock('../account', () => () => <div />)
jest.mock('../organizations', () => () => <div />)
jest.mock('../administration', () => () => <div />)
jest.mock('../editor', () => () => <div />)
jest.mock('../help', () => () => <div />)

describe('components/doc/dashboard', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(<Dashboard />)

    const tabs = screen.getAllByRole('tab')
    tabs.forEach((tab) => fireEvent.click(tab))

    unmount()
  })
})
