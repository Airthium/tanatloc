import { fireEvent, render, screen } from '@testing-library/react'

import Project from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockPush(),
    query: mockQuery()
  })
}))

jest.mock('@/components/assets/carousel', () => () => <div />)
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => <div role="Button" onClick={props.onAdd} />
}))

describe('components/doc/project', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Project />)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(<Project />)

    const tabs = screen.getAllByRole('tab')
    tabs.forEach((tab) => fireEvent.click(tab))

    unmount()
  })

  test('simulation', () => {
    mockQuery.mockImplementation(() => ({ tab: 'simulation' }))
    const { unmount } = render(<Project />)

    const buttons = screen.getAllByRole('Button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('view', () => {
    mockQuery.mockImplementation(() => ({ tab: 'view' }))
    const { unmount } = render(<Project />)

    unmount()
  })
})
