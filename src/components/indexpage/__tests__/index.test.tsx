import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Index from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockPush()
  })
}))

jest.mock('@/components/assets/side', () => (props: any) => (
  <div>
    {props.left}
    {props.right}
  </div>
))

jest.mock('../menu', () => ({
  __esModule: true,
  scrollToView: jest.fn,
  default: () => <div />
}))
jest.mock('../footer', () => () => <div />)

//@ts-ignore
global.fetch = async () => ({
  json: async () => [{ name: 'ok', assets_url: 'url' }]
})

describe('components/indexpage', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })

  test('buttons', () => {
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('frontpage', () => {
    process.env.NEXT_PUBLIC_SERVER_MODE = 'frontpage'
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    expect(mockPush).toHaveBeenCalledTimes(0)

    unmount()
  })

  test('drawers', () => {
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    const closes = screen.getAllByRole('button', { name: 'Close' })
    closes.forEach((close) => fireEvent.click(close))

    // Re-open
    buttons.forEach((button) => fireEvent.click(button))
    const collapse = screen.getByRole('button', {
      name: 'right "There is an error with your Docker installation." error'
    })
    fireEvent.click(collapse)

    const link = screen.getByRole('button', {
      name: 'Docker Desktop instructions'
    })
    fireEvent.click(link)

    unmount()
  })

  test('download', async () => {
    const { unmount } = render(<Index />)

    await waitFor(() => screen.getByRole('button', { name: 'Linux' }))

    const windows = screen.getByRole('button', { name: 'Windows' })
    const macos = screen.getByRole('button', { name: 'MacOS' })
    const linux = screen.getByRole('button', { name: 'Linux' })

    await act(() => fireEvent.click(windows))
    await act(() => fireEvent.click(macos))
    await act(() => fireEvent.click(linux))

    unmount()
  }, 10_000)

  test('release error', async () => {
    const { unmount } = render(<Index />)

    //@ts-ignore
    global.fetch = async () => {
      throw new Error('fetch error')
    }

    await waitFor(() => expect(screen.getByText('fetch error')))

    unmount()
  })
})
