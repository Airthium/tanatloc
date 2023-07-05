import { render, screen, waitFor } from '@testing-library/react'

import HPC, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  list: async () => mockList()
}))

jest.mock('../plugin', () => () => <div role="Plugin" />)

describe('components/account/hpc', () => {
  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockList.mockReset()
    mockList.mockImplementation(() => [])
  })

  test('render', async () => {
    const { unmount } = render(<HPC />)

    await waitFor(() =>
      screen.getByText('You do not have access to any HPC plugin. Request it.')
    )

    unmount()
  })

  test('plugins error', async () => {
    mockList.mockImplementation(() => {
      throw new Error('list error')
    })
    const { unmount } = render(<HPC />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.plugins,
        new Error('list error')
      )
    )

    unmount()
  })

  test('with plugins', async () => {
    mockList.mockImplementation(() => [
      {
        key: 'plugin',
        name: 'Plugin',
        category: 'HPC',
        configuration: {}
      }
    ])
    const { unmount } = render(<HPC />)

    await waitFor(() => screen.getByRole('Plugin'))

    unmount()
  })
})
