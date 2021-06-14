import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import CloudServer from '@/components/project/simulation/run/cloudServer'

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

const mockRenderer = jest.fn()
jest.mock('@/plugins', () => ({
  key: {
    renderer: (props) => mockRenderer(props)
  }
}))

const mockPlugins = jest.fn()
const mockErrorPlugins = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { errorPlugins: mockErrorPlugins() }]
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
    mockPush.mockReset()

    mockError.mockReset()

    mockRenderer.mockReset()
    mockRenderer.mockImplementation(() => <div />)

    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [
      {
        key: 'key',
        uuid: 'uuid',
        name: 'name',
        configuration: {
          name: {
            value: 'name'
          }
        }
      }
    ])
    mockErrorPlugins.mockReset()

    onOk.mockReset()
  })

  test('render', () => {
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

  test('onMerge', () => {
    mockRenderer.mockImplementation((props) => (
      <div role="Renderer" onClick={props.onSelect} />
    ))
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const renderer = screen.getByRole('Renderer')
    fireEvent.click(renderer)

    expect(onOk).toHaveBeenCalledTimes(1)

    unmount()
  })
})
