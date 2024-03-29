import { render } from '@testing-library/react'

import { HPCClientPlugin } from '@/plugins/index.d'

import List from '..'

jest.mock('../../dialog', () => () => <div />)

jest.mock('../../delete', () => () => <div />)

jest.mock('../../refresh', () => () => <div />)

describe('components/account/hpc/list', () => {
  const plugin = { key: 'key' }
  const plugins: HPCClientPlugin[] = []
  const swr = {
    delOnePlugin: jest.fn(),
    mutateOnePlugin: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(
      <List plugin={plugin} plugins={plugins} swr={swr} />
    )

    unmount()
  })

  test('haveInit', () => {
    const { unmount } = render(
      <List
        plugin={plugin}
        plugins={[
          {
            key: 'key',
            uuid: 'uuid',
            haveInit: true,
            configuration: {}
          } as HPCClientPlugin
        ]}
        swr={swr}
      />
    )

    unmount()
  })

  test('plugins', () => {
    const { unmount } = render(
      <List
        plugin={plugin}
        plugins={[
          {
            uuid: '0',
            key: '0',
            category: 'HPC',
            name: '0',
            description: '0',
            configuration: {}
          },
          {
            uuid: 'uuid',
            key: 'key',
            name: 'name',
            configuration: {
              name: {
                label: 'Name',
                type: 'input',
                value: 'name'
              },
              password: {
                label: 'Password',
                type: 'password',
                value: 'password'
              },
              textarea: {
                label: 'Textarea',
                type: 'textarea',
                value: 'code'
              },
              item1: {
                label: 'Item1',
                type: 'input'
              },
              //@ts-ignore
              item2: { value: 'item' }
            }
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })

  test('plugins - empty configuration', () => {
    const { unmount } = render(
      <List
        plugin={plugin}
        plugins={[
          {
            uuid: '0',
            key: 'key',
            category: 'HPC',
            name: '0',
            description: '0',
            configuration: {}
          },
          {
            uuid: 'uuid',
            key: '0',
            name: 'name',
            configuration: {
              name: {
                label: 'Name',
                type: 'input',
                value: 'name'
              },
              password: {
                label: 'Password',
                type: 'password',
                value: 'password'
              },
              textarea: {
                label: 'Textarea',
                type: 'textarea',
                value: 'code'
              },
              //@ts-ignore
              item: { value: 'item' }
            }
          }
        ]}
        swr={swr}
      />
    )

    unmount()
  })
})
