import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Plugins, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockPluginsCompleteList = jest.fn()
jest.mock('@/api/plugins', () => ({
  completeList: async () => mockPluginsCompleteList()
}))

const mockSystem = jest.fn()
const mockMutateSystem = jest.fn()
const mockSystemUpdate = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [
    mockSystem(),
    {
      mutateSystem: mockMutateSystem,
      loadingSystem: false
    }
  ],
  update: async (data: any) => mockSystemUpdate(data)
}))

describe('components/administration/plugins', () => {
  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockPluginsCompleteList.mockReset()

    mockSystem.mockReset()
    mockMutateSystem.mockReset()
    mockSystemUpdate.mockReset()
  })

  test('render', async () => {
    const { unmount } = render(<Plugins />)

    await waitFor(() => screen.getByText('No data'))

    unmount()
  })

  test('completeList error', async () => {
    mockPluginsCompleteList.mockImplementation(() => {
      throw new Error('completeList error')
    })

    const { unmount } = render(<Plugins />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.plugins,
        new Error('completeList error')
      )
    )

    unmount()
  })

  test('completeList', async () => {
    mockPluginsCompleteList.mockImplementation(() => [
      {
        name: 'Plugin 1',
        key: 'plugin'
      }
    ])

    const { unmount } = render(<Plugins />)

    await waitFor(() => screen.getByRole('cell', { name: 'Plugin 1' }))

    unmount()
  })

  test('onChange', async () => {
    mockPluginsCompleteList.mockImplementation(() => [
      {
        name: 'Plugin 1',
        key: 'plugin'
      }
    ])

    const { unmount } = render(<Plugins />)

    // Wait for loading
    await waitFor(() => screen.getByRole('cell', { name: 'Plugin 1' }))

    // Checkbox
    const checkbox = screen.getByRole('checkbox')
    await act(() => fireEvent.click(checkbox))

    await waitFor(() => expect(mockSystemUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockSystemUpdate).toHaveBeenLastCalledWith([
        {
          key: 'defaultplugins',
          type: 'array',
          method: 'append',
          value: 'plugin'
        }
      ])
    )
    await waitFor(() => expect(mockMutateSystem).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(0))

    // Error
    mockSystemUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(checkbox))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onChange - checked', async () => {
    mockSystem.mockImplementation(() => ({
      defaultplugins: ['plugin']
    }))
    mockPluginsCompleteList.mockImplementation(() => [
      {
        name: 'Plugin 1',
        key: 'plugin'
      }
    ])

    const { unmount } = render(<Plugins />)

    // Wait for loading
    await waitFor(() => {
      const check = screen.getByRole('checkbox')
      expect(check).toHaveProperty('checked', true)
    })

    // Checkbox
    const checkbox = screen.getByRole('checkbox')
    await act(() => fireEvent.click(checkbox))
    await waitFor(() => expect(mockSystemUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockSystemUpdate).toHaveBeenLastCalledWith([
        {
          key: 'defaultplugins',
          type: 'array',
          method: 'remove',
          value: 'plugin'
        }
      ])
    )
    await waitFor(() => expect(mockMutateSystem).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onResize', async () => {
    Object.defineProperty(Element.prototype, 'clientHeight', {
      value: '1000'
    })

    const { unmount } = render(<Plugins />)

    await waitFor(() => screen.getByText('No data'))

    unmount()
  })
})
