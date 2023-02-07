import { render, screen, waitFor } from '@testing-library/react'

import Changelog from '..'

const mockFetch = jest.fn()
global.fetch = async () => mockFetch()

describe('components/doc/changelog', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockImplementation(() => ({
      text: async () => 'changelog content'
    }))
  })

  test('render', async () => {
    const { unmount } = render(<Changelog />)

    await waitFor(() => screen.getByText('changelog content'))

    unmount()
  })

  test('fetch error', async () => {
    mockFetch.mockImplementation(() => ({
      text: async () => {
        throw new Error('fetch error')
      }
    }))

    const { unmount } = render(<Changelog />)

    await waitFor(() =>
      screen.getByText(
        'Unable to fetch CHANGELOG at https://github.com/Airthium/tanatloc/blob/master/CHANGELOG.md',
        { exact: false }
      )
    )

    unmount()
  })
})
