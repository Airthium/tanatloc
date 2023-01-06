import { fireEvent, render, screen } from '@testing-library/react'
import Menu from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockPush()
  })
}))

const mockUser = jest.fn()
const mockLoadingUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [mockUser(), { loadingUser: mockLoadingUser() }]
}))

//@ts-ignore
window.open = jest.fn

describe('components/indexpage/menu', () => {
  beforeEach(() => {
    mockPush.mockReset()

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({}))
    mockLoadingUser.mockReset()
    mockLoadingUser.mockImplementation(() => false)
  })

  test('render', () => {
    const { unmount } = render(<Menu />)

    unmount()
  })

  test('buttons', () => {
    const { unmount } = render(
      <>
        <Menu />
        <div id="aboutUs"></div>
      </>
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('loading', () => {
    mockUser.mockImplementation(() => null)
    mockLoadingUser.mockImplementation(() => true)
    const { unmount } = render(<Menu />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('no user', () => {
    mockUser.mockImplementation(() => null)
    const { unmount } = render(<Menu />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })

  test('front mode', () => {
    mockUser.mockImplementation(() => null)
    process.env.NEXT_PUBLIC_SERVER_MODE = 'frontpage'
    const { unmount } = render(<Menu />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    unmount()
  })
})
