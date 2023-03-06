import { fireEvent, render, screen } from '@testing-library/react'

import Plugins from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery()
  })
}))

jest.mock('@/components/assets/carousel', () => () => <div />)

describe('components/doc/plugins', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Plugins />)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(<Plugins />)

    const tabs = screen.getAllByRole('tab')
    tabs.forEach((tab) => fireEvent.click(tab))

    unmount()
  })

  test('model', () => {
    mockQuery.mockImplementation(() => ({ tab: 'model' }))
    const { unmount } = render(<Plugins />)

    unmount()
  })
})
