import { act, fireEvent, render, screen } from '@testing-library/react'

import Cookies from '..'

const mockUseCookies = jest.fn()
jest.mock('react-cookie', () => ({
  useCookies: () => mockUseCookies()
}))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

describe('components/assets/cookies', () => {
  const setCookie = jest.fn()
  const removeCookie = jest.fn()

  beforeEach(() => {
    setCookie.mockReset()
    removeCookie.mockReset()

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockUseCookies.mockReset()
    mockUseCookies.mockImplementation(() => [{}, setCookie, removeCookie])
  })

  test('render', () => {
    const { unmount } = render(<Cookies />)

    unmount()
  })

  test('electron', () => {
    mockIsElectron.mockImplementation(() => true)
    const { unmount } = render(<Cookies />)

    unmount()
  })

  test('save & close - empty', async () => {
    const { unmount } = render(<Cookies />)

    const collapse1 = screen.getByRole('button', {
      name: 'collapsed More details'
    })
    fireEvent.click(collapse1)

    const button = screen.getByRole('button', { name: 'Save & Close' })

    // Not accepted
    await act(() => fireEvent.click(button))

    expect(setCookie).toHaveBeenCalledTimes(0)
    expect(removeCookie).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('save & close - accepted', async () => {
    const { unmount } = render(<Cookies />)

    const collapse1 = screen.getByRole('button', {
      name: 'collapsed More details'
    })
    fireEvent.click(collapse1)

    // Accepted
    const switchButton = screen.getByRole('switch', { name: 'Essential' })
    fireEvent.click(switchButton)

    const button = screen.getByRole('button', { name: 'Save & Close' })
    await act(() => fireEvent.click(button))

    expect(setCookie).toHaveBeenCalledTimes(2)
    expect(removeCookie).toHaveBeenCalledTimes(0)

    unmount()
  })

  test('accepted', () => {
    mockUseCookies.mockImplementation(() => [
      { accepted: true, setCookie, removeCookie }
    ])
    const { unmount } = render(<Cookies />)

    unmount()
  })

  test('all', () => {
    const { unmount } = render(<Cookies />)

    const button = screen.getByRole('button', { name: 'Accept all' })
    fireEvent.click(button)

    expect(setCookie).toHaveBeenCalledTimes(2)

    unmount()
  })
})
