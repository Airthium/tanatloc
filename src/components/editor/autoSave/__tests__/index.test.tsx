import { fireEvent, render, screen } from '@testing-library/react'
import AutoSave from '..'

const mockUseCookies = jest.fn()
jest.mock('react-cookie', () => ({
  useCookies: () => mockUseCookies()
}))

Object.defineProperty(global, 'setInterval', {
  value: (callback: Function) => callback()
})

describe('components/editor/autoSave', () => {
  beforeEach(() => {
    mockUseCookies.mockReset()
    mockUseCookies.mockImplementation(() => [{}])
  })

  test('render', () => {
    const { unmount } = render(<AutoSave />)

    unmount()
  })

  test('accepted', () => {
    mockUseCookies.mockImplementation(() => [{ accepted: 'true' }])
    const { unmount } = render(<AutoSave />)

    unmount()
  })

  test('uncheck', () => {
    mockUseCookies.mockImplementation(() => [{ accepted: 'true' }])
    const { unmount } = render(<AutoSave />)

    const switcher = screen.getByRole('switch')
    fireEvent.click(switcher)

    unmount()
  })

  test('reload', () => {
    mockUseCookies.mockImplementation(() => [{ accepted: 'true' }])
    const { unmount } = render(<AutoSave />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    sessionStorage.removeItem('model')
    sessionStorage.removeItem('template')
    fireEvent.click(button)

    unmount()
  })
})
