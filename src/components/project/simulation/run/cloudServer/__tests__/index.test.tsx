import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { HPCClientPlugin } from '@/plugins/index.d'

import CloudServer from '@/components/project/simulation/run/cloudServer'

jest.mock('/plugins/key/src/components', () => {}, { virtual: true })

const mockDynamic = jest.fn()
jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return mockDynamic()
})

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockPush()
  })
}))

jest.mock('@sentry/nextjs', () => ({ init: jest.fn }))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockPlugins = jest.fn()
const mockErrorPlugins = jest.fn()
const mockPluginExtra = jest.fn()
jest.mock('@/api/plugin', () => ({
  usePlugins: () => [mockPlugins(), { errorPlugins: mockErrorPlugins() }],
  extra: async () => mockPluginExtra()
}))

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  list: async () => mockList()
}))

describe('components/project/simulation/run/cloudServer', () => {
  const RendererRole = 'Renderer'
  const cloudServer = {
    configuration: {
      name: { label: 'Name', type: 'input', value: 'name' }
    },
    inUseConfiguration: {
      item: {
        label: 'item',
        value: 'value'
      },
      otheritem: {
        label: 'bool',
        value: true
      },
      parallelItem: {
        label: 'parallel',
        parallelOnly: true,
        value: 'value'
      },
      otherotheritem: {
        label: 'bool again',
        value: false
      }
    }
  } as unknown as HPCClientPlugin
  const onOk = jest.fn()

  beforeEach(() => {
    mockDynamic.mockReset()
    mockDynamic.mockImplementation(() => 'div')

    mockPush.mockReset()

    mockErrorNotification.mockReset()

    mockPlugins.mockReset()
    mockPlugins.mockImplementation(() => [
      {
        key: 'key',
        category: 'HPC',
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
    mockPluginExtra.mockReset()

    mockList.mockReset()
    mockList.mockImplementation(() => [
      {
        key: 'key',
        category: 'HPC'
      }
    ])

    onOk.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    unmount()
  })

  test('without inUseConfiguration', () => {
    const { unmount } = render(
      <CloudServer
        cloudServer={
          {
            configuration: {
              name: { label: 'Name', type: 'input', value: 'name' }
            }
          } as unknown as HPCClientPlugin
        }
        onOk={onOk}
      />
    )

    unmount()
  })

  test('with extra', async () => {
    const { unmount } = render(
      <CloudServer
        cloudServer={{
          ...cloudServer,
          extra: {
            test: {
              type: 'button',
              label: 'Test',
              action: 'action',
              icon: 'cloud-download'
            },
            test2: {
              //@ts-ignore
              type: 'other',
              label: 'Test',
              action: 'action',
              icon: 'icon'
            }
          }
        }}
        onOk={onOk}
      />
    )

    const extra = screen.getByRole('button', { name: 'cloud-download' })

    // Normal
    fireEvent.click(extra)
    await waitFor(() => expect(mockPluginExtra).toHaveBeenCalledTimes(1))

    // Erorr
    mockPluginExtra.mockImplementation(() => {
      throw new Error('plugin extra error')
    })
    fireEvent.click(extra)
    await waitFor(() => expect(mockPluginExtra).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('empty plugins', () => {
    mockPlugins.mockImplementation(() => [])
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    // Set visible
    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('without cloud server', () => {
    const { unmount } = render(<CloudServer onOk={onOk} />)

    unmount()
  })

  test('error', () => {
    mockErrorPlugins.mockImplementation(() => true)
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )
    expect(mockErrorNotification).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('plugins error', async () => {
    mockList.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

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
    mockDynamic.mockImplementation(() => (props: any) => (
      <div
        role={RendererRole}
        onClick={props.onSelect}
        onKeyUp={console.debug}
      />
    ))

    const { unmount } = render(
      <CloudServer cloudServer={cloudServer} onOk={onOk} />
    )

    // Set visible
    const button = screen.getByRole('button')
    await act(() => fireEvent.click(button))

    await waitFor(() => screen.getByText('Plugin name'))

    const renderer = screen.getByRole(RendererRole)
    await act(() => fireEvent.click(renderer))

    expect(onOk).toHaveBeenCalledTimes(1)

    unmount()
  })
})
