import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Installation from '..'

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockPush(),
    query: mockQuery()
  })
}))

const mockFetch = jest.fn()
global.fetch = async () => mockFetch()

const mockOpen = jest.fn()
window.open = mockOpen

describe('components/doc/installation', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockFetch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Installation />)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(<Installation />)

    const tabs = screen.getAllByRole('tab')
    tabs.forEach((tab) => fireEvent.click(tab))

    unmount()
  })

  test('download', async () => {
    mockFetch.mockImplementation(() => ({
      json: async () => [
        { name: '1.0.0-alpha' },
        { name: '1.0.0-beta' },
        { name: '1.0.0', assets_url: 'url' },
        {
          name: 'Tanatloc-v1.0.0.AppImage',
          browser_download_url: 'url'
        },
        {
          name: 'Tanatloc-v1.0.0.dmg',
          browser_download_url: 'url'
        },
        {
          name: 'Tanatloc-v1.0.0.exe',
          browser_download_url: 'url'
        }
      ]
    }))

    const { unmount } = render(<Installation />)

    await waitFor(() => screen.getByRole('button', { name: 'Linux' }))

    const linux = screen.getByRole('button', { name: 'Linux' })
    const windows = screen.getByRole('button', { name: 'Windows' })
    const macOS = screen.getByRole('button', { name: 'MacOS' })

    fireEvent.click(linux)
    fireEvent.click(windows)
    fireEvent.click(macOS)

    unmount()
  })

  test('download - no assets', async () => {
    mockFetch.mockImplementation(() => ({
      json: async () => [{ name: '1.0.0', assets_url: 'url' }]
    }))

    const { unmount } = render(<Installation />)

    await waitFor(() => screen.getByText('Version: 1.0.0'))

    unmount()
  })

  test('server', () => {
    mockQuery.mockImplementation(() => ({ tab: 'server' }))
    const { unmount } = render(<Installation />)

    const coll1 = screen.getByRole('button', {
      name: 'right ./tanatloc.sh set'
    })
    const coll2 = screen.getByRole('button', {
      name: 'right ./tanatloc.sh add'
    })

    fireEvent.click(coll1)
    fireEvent.click(coll2)

    unmount()
  })
})
