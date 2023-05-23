import { render } from '@testing-library/react'

import GoogleTag from '..'

const mockUseCookies = jest.fn()
jest.mock('react-cookie', () => ({
  useCookies: () => mockUseCookies()
}))

describe('components/assets/gtag', () => {
  beforeEach(() => {
    mockUseCookies.mockReset()
    mockUseCookies.mockImplementation(() => [{}])
  })

  test('render', () => {
    const { unmount } = render(<GoogleTag />)

    unmount()
  })

  test('ok', () => {
    mockUseCookies.mockImplementation(() => [{ 'gpdr-gtag-accept': 'true' }])
    const { unmount } = render(<GoogleTag />)

    const script = document.getElementsByTagName('script')[0]
    script.onload?.(new Event(''))
    script.onerror?.('')

    unmount()
  })
})
