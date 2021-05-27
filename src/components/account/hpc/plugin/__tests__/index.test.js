import React from 'react'
import { render, screen } from '@testing-library/react'

import Plugin from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../dialog', () => {
  const PluginDialog = () => <div role="PluginDialog" />
  return PluginDialog
})

jest.mock('../list', () => {
  const List = () => <div role="List" />
  return List
})

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
  const plugin = { key: 'key' }

  beforeEach(() => {
    mockError.mockReset()

    mockPlugins.mockReset()
    mockAddOnePlugin.mockReset()
    mockDelOnePlugin.mockReset()
    mockMutateOnePlugin.mockReset()
    mockLoadingPlugins.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Plugin plugin={plugin} />)

    unmount()
  })

  // test('loading', () => {
  //   wrapper.unmount()
  //   mockLoadingPlugins.mockImplementation(() => true)
  //   wrapper = shallow(<Plugin plugin={plugin} />)
  //   expect(wrapper.find('Spin').length).toBe(1)
  // })

  // test('effect', () => {
  //   wrapper.unmount()
  //   wrapper = mount(<Plugin plugin={plugin} />)

  //   // With error
  //   mockErrorPlugins.mockImplementation(() => ({ message: 'Error' }))
  //   wrapper.unmount()
  //   wrapper = mount(<Plugin plugin={plugin} />)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
