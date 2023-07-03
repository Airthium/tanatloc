import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IClientPlugin } from '@/plugins/index.d'

import Refresh, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/plugin', () => ({
  update: (plugin: IClientPlugin) => mockUpdate(plugin)
}))

describe('components/account/hpc/refresh', () => {
  const plugin = {}

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Refresh plugin={plugin} />)

    unmount()
  })

  test('onUpdate', async () => {
    const { unmount } = render(<Refresh plugin={plugin} />)

    const button = screen.getByRole('button')

    // Normal
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith({ needReInit: true })
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.refresh,
        new Error('update error')
      )
    )

    unmount()
  })
})
