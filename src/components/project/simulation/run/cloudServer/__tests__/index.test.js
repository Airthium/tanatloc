import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import CloudServer from '@/components/project/simulation/run/cloudServer'

jest.mock('/plugins/key/src/components', () => {}, { virtual: true })

const mockDynamic = jest.fn()
jest.mock('next/dynamic', () => (callback) => {
  callback()
  return mockDynamic()
})

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockPush()
  })
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockPlugins = jest.fn()
const mockErrorPlugins = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { errorPlugins: mockErrorPlugins() }]
}))

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  list: async () => mockList()
}))

describe('components/project/simulation/run/cloudServer', () => {
  const cloudServer = {
    inUseConfiguration: {
      item: {
        label: 'item',
        value: 'value'
      }
    }
  }
  const onOk = jest.fn()

  beforeEach(() => {
    mockDynamic.mockReset()
    mockDynamic.mockImplementation(() => 'div')

    mockPush.mockReset()

    mockError.mockReset()

    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [
      {
        key: 'key',
        uuid: 'uuid',
        name: 'name',
        configuration: {
          name: {
            value: 'Plugin name'
          }
        }
      }
    ])
    mockErrorPlugins.mockReset()

    mockList.mockReset()
    mockList.mockImplementation(() => [
      {
        key: 'key'
      }
    ])

    onOk.mockReset()
  })

  test('render', async () => {
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    unmount()
  })

  test('error', () => {
    mockErrorPlugins.mockImplementation(() => true)
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )
    expect(mockError).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('plugins error', async () => {
    mockList.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('router', () => {
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const account = screen.getByRole('button', { name: 'account settings' })
    fireEvent.click(account)

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('close', () => {
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const close = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(close)

    unmount()
  })

  test('onMerge', async () => {
    mockDynamic.mockImplementation(() => (props) => (
      <div role="Renderer" onClick={props.onSelect} />
    ))

    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => screen.getByText('Plugin name'))

    const renderer = screen.getByRole('Renderer')
    fireEvent.click(renderer)

    expect(onOk).toHaveBeenCalledTimes(1)

    unmount()
  })
})
