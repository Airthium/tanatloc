import React from 'react'
import { render } from '@testing-library/react'

import Plugin from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../dialog', () => () => <div role="PluginDialog" />)

jest.mock('../list', () => () => <div role="List" />)

const mockPlugins = jest.fn()
const mockAddOnePlugin = jest.fn()
const mockDelOnePlugin = jest.fn()
const mockMutateOnePlugin = jest.fn()
const mockErrorPlugins = jest.fn()
const mockLoadingPlugins = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [
    mockPlugins(),
    {
      addOnePlugin: mockAddOnePlugin,
      delOnePlugin: mockDelOnePlugin,
      mutateOnePlugin: mockMutateOnePlugin,
      errorPlugins: mockErrorPlugins(),
      loadingPlugins: mockLoadingPlugins()
    }
  ]
}))

describe('component/account/hpc/plugin', () => {
  const plugin = { key: 'key', name: 'Plugin', configuration: {} }

  beforeEach(() => {
    mockError.mockReset()

    mockPlugins.mockReset()
    mockAddOnePlugin.mockReset()
    mockDelOnePlugin.mockReset()
    mockMutateOnePlugin.mockReset()
    mockErrorPlugins.mockReset()
    mockLoadingPlugins.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Plugin plugin={plugin} />)

    unmount()
  })

  test('loading', () => {
    mockLoadingPlugins.mockImplementation(() => true)
    const { unmount } = render(<Plugin plugin={plugin} />)

    unmount()
  })

  test('error', () => {
    mockErrorPlugins.mockImplementation(() => true)
    const { unmount } = render(<Plugin plugin={plugin} />)
    expect(mockError).toHaveBeenCalledTimes(1)

    unmount()
  })
})
